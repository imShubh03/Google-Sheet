"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Header from "./header"
import Toolbar from "./toolbar"
import FormulaBar from "./formula-bar"
import Grid from "./grid"
import SheetTabs from "./sheet-tab"
import type { Cell, SpreadsheetData, CellPosition, CellStyle } from "@/lib/types"
import { evaluateFormula } from "@/lib/formula-parser"
import { initializeSpreadsheet, getColumnLabel } from "@/lib/utils"

export default function Spreadsheet() {
    // Initialize with 100 rows and 26 columns (A-Z)
    const [data, setData] = useState<SpreadsheetData>(() => initializeSpreadsheet(100, 26))
    const [activeCell, setActiveCell] = useState<CellPosition | null>(null)
    const [selectedRange, setSelectedRange] = useState<{ start: CellPosition; end: CellPosition } | null>(null)
    const [formulaValue, setFormulaValue] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState<CellPosition | null>(null)
    const [sheets, setSheets] = useState<string[]>(["Sheet1"])
    const [activeSheet, setActiveSheet] = useState("Sheet1")

    // Get active cell label (e.g., A1)
    const activeCellLabel = useMemo(() => {
        if (!activeCell) return "A1"
        return `${getColumnLabel(activeCell.col)}${activeCell.row + 1}`
    }, [activeCell])

    // Update formula bar when active cell changes
    useEffect(() => {
        if (activeCell) {
            const cell = data[activeCell.row][activeCell.col]
            setFormulaValue(cell.formula || cell.value?.toString() || "")
        } else {
            setFormulaValue("")
        }
    }, [activeCell, data])

    // Handle cell value change
    const updateCellValue = useCallback((row: number, col: number, value: string, isFormula = false) => {
        setData((prevData) => {
            const newData = { ...prevData }

            if (isFormula) {
                newData[row][col] = {
                    ...newData[row][col],
                    formula: value,
                    value: evaluateFormula(value, newData),
                }
            } else {
                newData[row][col] = {
                    ...newData[row][col],
                    value: value,
                    formula: null,
                }
            }

            // Update dependent cells
            updateDependentCells(newData, row, col)

            return newData
        })
    }, [])

    // Update cells that depend on the changed cell
    const updateDependentCells = (data: SpreadsheetData, row: number, col: number) => {
        // In a real implementation, we would maintain a dependency graph
        // For simplicity, we'll just re-evaluate all formulas
        Object.keys(data).forEach((r) => {
            Object.keys(data[Number(r)]).forEach((c) => {
                const cell = data[Number(r)][Number(c)]
                if (cell.formula) {
                    cell.value = evaluateFormula(cell.formula, data)
                }
            })
        })
    }

    // Apply style to selected cells
    const applyStyle = useCallback(
        (style: Partial<CellStyle>) => {
            if (!selectedRange) return

            setData((prevData) => {
                const newData = { ...prevData }
                const startRow = Math.min(selectedRange.start.row, selectedRange.end.row)
                const endRow = Math.max(selectedRange.start.row, selectedRange.end.row)
                const startCol = Math.min(selectedRange.start.col, selectedRange.end.col)
                const endCol = Math.max(selectedRange.start.col, selectedRange.end.col)

                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {
                        newData[row][col] = {
                            ...newData[row][col],
                            style: {
                                ...newData[row][col].style,
                                ...style,
                            },
                        }
                    }
                }

                return newData
            })
        },
        [selectedRange],
    )

    // Add row at specified index
    const addRow = useCallback((index: number) => {
        setData((prevData) => {
            const newData = { ...prevData }
            const newRow: Record<number, Cell> = {}

            // Create empty cells for the new row
            for (let col = 0; col < Object.keys(prevData[0]).length; col++) {
                newRow[col] = { value: "", style: {} }
            }

            // Shift rows down
            for (let row = Object.keys(newData).length - 1; row >= index; row--) {
                newData[row + 1] = { ...newData[row] }
            }

            // Insert new row
            newData[index] = newRow

            return newData
        })
    }, [])

    // Delete row at specified index
    const deleteRow = useCallback((index: number) => {
        setData((prevData) => {
            const newData = { ...prevData }

            // Shift rows up
            for (let row = index; row < Object.keys(newData).length - 1; row++) {
                newData[row] = { ...newData[row + 1] }
            }

            // Delete last row
            delete newData[Object.keys(newData).length - 1]

            return newData
        })
    }, [])

    // Add column at specified index
    const addColumn = useCallback((index: number) => {
        setData((prevData) => {
            const newData = { ...prevData }

            // For each row, shift columns right and add new column
            Object.keys(newData).forEach((row) => {
                const rowData = newData[Number(row)]

                // Shift columns right
                for (let col = Object.keys(rowData).length - 1; col >= index; col--) {
                    rowData[col + 1] = { ...rowData[col] }
                }

                // Insert new column
                rowData[index] = { value: "", style: {} }
            })

            return newData
        })
    }, [])

    // Delete column at specified index
    const deleteColumn = useCallback((index: number) => {
        setData((prevData) => {
            const newData = { ...prevData }

            // For each row, shift columns left
            Object.keys(newData).forEach((row) => {
                const rowData = newData[Number(row)]

                // Shift columns left
                for (let col = index; col < Object.keys(rowData).length - 1; col++) {
                    rowData[col] = { ...rowData[col + 1] }
                }

                // Delete last column
                delete rowData[Object.keys(rowData).length - 1]
            })

            return newData
        })
    }, [])

    // Handle formula submission
    const handleFormulaSubmit = useCallback(
        (value: string) => {
            if (!activeCell) return

            if (value.startsWith("=")) {
                updateCellValue(activeCell.row, activeCell.col, value, true)
            } else {
                updateCellValue(activeCell.row, activeCell.col, value, false)
            }
        },
        [activeCell, updateCellValue],
    )

    // Handle cell selection
    const handleCellSelect = useCallback((row: number, col: number) => {
        setActiveCell({ row, col })
        setSelectedRange({ start: { row, col }, end: { row, col } })
    }, [])

    // Handle drag start
    const handleDragStart = useCallback((row: number, col: number) => {
        setIsDragging(true)
        setDragStart({ row, col })
    }, [])

    // Handle drag over
    const handleDragOver = useCallback(
        (row: number, col: number) => {
            if (isDragging && dragStart) {
                setSelectedRange({
                    start: dragStart,
                    end: { row, col },
                })
            }
        },
        [isDragging, dragStart],
    )

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        setIsDragging(false)
        setDragStart(null)
    }, [])

    // Add new sheet
    const handleAddSheet = useCallback(() => {
        const newSheetNumber = sheets.length + 1
        const newSheetName = `Sheet${newSheetNumber}`
        setSheets([...sheets, newSheetName])
        setActiveSheet(newSheetName)
    }, [sheets])

    return (
        <div className="flex flex-col h-screen">
            <Header onUndo={function (): void {
                throw new Error("Function not implemented.")
            } } onRedo={function (): void {
                throw new Error("Function not implemented.")
            } } onCut={function (): void {
                throw new Error("Function not implemented.")
            } } onCopy={function (): void {
                throw new Error("Function not implemented.")
            } } onPaste={function (): void {
                throw new Error("Function not implemented.")
            } } onFind={function (): void {
                throw new Error("Function not implemented.")
            } } onFindAndReplace={function (): void {
                throw new Error("Function not implemented.")
            } } />
            <Toolbar
                onApplyStyle={applyStyle}
                onAddRow={() => activeCell && addRow(activeCell.row)}
                onDeleteRow={() => activeCell && deleteRow(activeCell.row)}
                onAddColumn={() => activeCell && addColumn(activeCell.col)}
                onDeleteColumn={() => activeCell && deleteColumn(activeCell.col)}
            />
            <FormulaBar
                value={formulaValue}
                onChange={setFormulaValue}
                onSubmit={handleFormulaSubmit}
                activeCellLabel={activeCellLabel}
            />
            <Grid
                data={data}
                activeCell={activeCell}
                selectedRange={selectedRange}
                onCellSelect={handleCellSelect}
                onCellChange={updateCellValue}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            />
            <SheetTabs sheets={sheets} activeSheet={activeSheet} onSheetChange={setActiveSheet} onAddSheet={handleAddSheet} />
        </div>
    )
}

