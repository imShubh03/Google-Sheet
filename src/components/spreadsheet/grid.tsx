"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import type { SpreadsheetData, CellPosition } from "@/lib/types"
import { getColumnLabel } from "@/lib/utils"
import Cell from "./cell"

interface GridProps {
    data: SpreadsheetData
    activeCell: CellPosition | null
    selectedRange: { start: CellPosition; end: CellPosition } | null
    onCellSelect: (row: number, col: number) => void
    onCellChange: (row: number, col: number, value: string, isFormula?: boolean) => void
    onDragStart: (row: number, col: number) => void
    onDragOver: (row: number, col: number) => void
    onDragEnd: () => void
}

export default function Grid({
    data,
    activeCell,
    selectedRange,
    onCellSelect,
    onCellChange,
    onDragStart,
    onDragOver,
    onDragEnd,
}: GridProps) {
    const gridRef = useRef<HTMLDivElement>(null)
    const [columnWidths, setColumnWidths] = useState<Record<number, number>>({})
    const [rowHeights, setRowHeights] = useState<Record<number, number>>({})
    const [resizingColumn, setResizingColumn] = useState<number | null>(null)
    const [resizingRow, setResizingRow] = useState<number | null>(null)
    const [startResizePos, setStartResizePos] = useState(0)
    const [startSize, setStartSize] = useState(0)
    const [visibleRows, setVisibleRows] = useState({ start: 0, end: 30 })
    const [visibleCols, setVisibleCols] = useState({ start: 0, end: 15 })

    // Calculate visible range based on scroll position
    const updateVisibleRange = useCallback(() => {
        if (!gridRef.current) return

        const scrollTop = gridRef.current.scrollTop
        const scrollLeft = gridRef.current.scrollLeft
        const clientHeight = gridRef.current.clientHeight
        const clientWidth = gridRef.current.clientWidth

        // Estimate row and column indices based on average sizes
        const avgRowHeight = 24
        const avgColWidth = 100

        const startRow = Math.max(0, Math.floor(scrollTop / avgRowHeight) - 5)
        const endRow = Math.min(Object.keys(data).length - 1, Math.ceil((scrollTop + clientHeight) / avgRowHeight) + 5)

        const startCol = Math.max(0, Math.floor(scrollLeft / avgColWidth) - 2)
        const endCol = Math.min(
            Object.keys(data[0] || {}).length - 1,
            Math.ceil((scrollLeft + clientWidth) / avgColWidth) + 2,
        )

        setVisibleRows({ start: startRow, end: endRow })
        setVisibleCols({ start: startCol, end: endCol })
    }, [data])

    // Check if a cell is in the selected range
    const isCellSelected = useCallback(
        (row: number, col: number) => {
            if (!selectedRange) return false

            const startRow = Math.min(selectedRange.start.row, selectedRange.end.row)
            const endRow = Math.max(selectedRange.start.row, selectedRange.end.row)
            const startCol = Math.min(selectedRange.start.col, selectedRange.end.col)
            const endCol = Math.max(selectedRange.start.col, selectedRange.end.col)

            return row >= startRow && row <= endRow && col >= startCol && col <= endCol
        },
        [selectedRange],
    )

    // Handle column resize start
    const handleColumnResizeStart = useCallback(
        (col: number, e: React.MouseEvent) => {
            e.preventDefault()
            setResizingColumn(col)
            setStartResizePos(e.clientX)
            setStartSize(columnWidths[col] || 100)

            document.addEventListener("mousemove", handleColumnResizeMove)
            document.addEventListener("mouseup", handleColumnResizeEnd)
        },
        [columnWidths],
    )

    // Handle column resize move
    const handleColumnResizeMove = useCallback(
        (e: MouseEvent) => {
            if (resizingColumn === null) return

            const diff = e.clientX - startResizePos
            const newWidth = Math.max(50, startSize + diff)

            setColumnWidths((prev) => ({
                ...prev,
                [resizingColumn]: newWidth,
            }))
        },
        [resizingColumn, startResizePos, startSize],
    )

    // Handle column resize end
    const handleColumnResizeEnd = useCallback(() => {
        setResizingColumn(null)
        document.removeEventListener("mousemove", handleColumnResizeMove)
        document.removeEventListener("mouseup", handleColumnResizeEnd)
    }, [handleColumnResizeMove])

    // Handle row resize start
    const handleRowResizeStart = useCallback(
        (row: number, e: React.MouseEvent) => {
            e.preventDefault()
            setResizingRow(row)
            setStartResizePos(e.clientY)
            setStartSize(rowHeights[row] || 24)

            document.addEventListener("mousemove", handleRowResizeMove)
            document.addEventListener("mouseup", handleRowResizeEnd)
        },
        [rowHeights],
    )

    // Handle row resize move
    const handleRowResizeMove = useCallback(
        (e: MouseEvent) => {
            if (resizingRow === null) return

            const diff = e.clientY - startResizePos
            const newHeight = Math.max(20, startSize + diff)

            setRowHeights((prev) => ({
                ...prev,
                [resizingRow]: newHeight,
            }))
        },
        [resizingRow, startResizePos, startSize],
    )

    // Handle row resize end
    const handleRowResizeEnd = useCallback(() => {
        setResizingRow(null)
        document.removeEventListener("mousemove", handleRowResizeMove)
        document.removeEventListener("mouseup", handleRowResizeEnd)
    }, [handleRowResizeMove])

    // Set up scroll event listener
    useEffect(() => {
        const grid = gridRef.current
        if (grid) {
            grid.addEventListener("scroll", updateVisibleRange)
            updateVisibleRange()
        }

        return () => {
            if (grid) {
                grid.removeEventListener("scroll", updateVisibleRange)
            }
        }
    }, [updateVisibleRange])

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleColumnResizeMove)
            document.removeEventListener("mouseup", handleColumnResizeEnd)
            document.removeEventListener("mousemove", handleRowResizeMove)
            document.removeEventListener("mouseup", handleRowResizeEnd)
        }
    }, [handleColumnResizeMove, handleColumnResizeEnd, handleRowResizeMove, handleRowResizeEnd])

    // Memoize visible column headers
    const columnHeaders = useMemo(() => {
        return Array.from({ length: Object.keys(data[0] || {}).length }, (_, colIndex) => {
            if (colIndex < visibleCols.start || colIndex > visibleCols.end) return null

            return (
                <div
                    key={`col-${colIndex}`}
                    className="relative flex items-center justify-center border-r bg-gray-100 select-none"
                    style={{
                        width: `${columnWidths[colIndex] || 100}px`,
                        height: "24px",
                        position: "absolute",
                        left: `${colIndex * (columnWidths[colIndex] || 100)}px`,
                    }}
                >
                    {getColumnLabel(colIndex)}
                    <div
                        className="absolute top-0 right-0 w-1 h-full cursor-col-resize"
                        onMouseDown={(e) => handleColumnResizeStart(colIndex, e)}
                    />
                </div>
            )
        })
    }, [visibleCols, columnWidths, data, handleColumnResizeStart])

    // Memoize visible row headers
    const rowHeaders = useMemo(() => {
        return Array.from({ length: Object.keys(data).length }, (_, rowIndex) => {
            if (rowIndex < visibleRows.start || rowIndex > visibleRows.end) return null

            return (
                <div
                    key={`row-${rowIndex}`}
                    className="relative flex items-center justify-center border-b bg-gray-100 select-none"
                    style={{
                        width: "40px",
                        height: `${rowHeights[rowIndex] || 24}px`,
                        position: "absolute",
                        top: `${rowIndex * (rowHeights[rowIndex] || 24)}px`,
                    }}
                >
                    {rowIndex + 1}
                    <div
                        className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize"
                        onMouseDown={(e) => handleRowResizeStart(rowIndex, e)}
                    />
                </div>
            )
        })
    }, [visibleRows, rowHeights, data, handleRowResizeStart])

    // Calculate total grid height and width
    const totalHeight = useMemo(() => {
        return Object.keys(data).reduce((sum, row) => sum + (rowHeights[Number(row)] || 24), 0)
    }, [data, rowHeights])

    const totalWidth = useMemo(() => {
        return Object.keys(data[0] || {}).reduce((sum, col) => sum + (columnWidths[Number(col)] || 100), 0)
    }, [data, columnWidths])

    // Render only visible cells for better performance
    const visibleCells = useMemo(() => {
        const cells = []

        for (let rowIndex = visibleRows.start; rowIndex <= visibleRows.end; rowIndex++) {
            if (!data[rowIndex]) continue

            const rowTop = Array.from({ length: rowIndex }, (_, i) => rowHeights[i] || 24).reduce((a, b) => a + b, 0)

            for (let colIndex = visibleCols.start; colIndex <= visibleCols.end; colIndex++) {
                if (!data[rowIndex][colIndex]) continue

                const colLeft = Array.from({ length: colIndex }, (_, i) => columnWidths[i] || 100).reduce((a, b) => a + b, 0)

                cells.push(
                    <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        style={{
                            position: "absolute",
                            top: `${rowTop}px`,
                            left: `${colLeft}px`,
                            height: `${rowHeights[rowIndex] || 24}px`,
                        }}
                    >
                        <Cell
                            value={data[rowIndex][colIndex].value?.toString() || ""}
                            formula={data[rowIndex][colIndex].formula || ""}
                            style={data[rowIndex][colIndex].style || {}}
                            width={columnWidths[colIndex] || 100}
                            isActive={activeCell?.row === rowIndex && activeCell?.col === colIndex}
                            isSelected={isCellSelected(rowIndex, colIndex)}
                            onChange={(value) => onCellChange(rowIndex, colIndex, value)}
                            onSelect={() => onCellSelect(rowIndex, colIndex)}
                            onDragStart={() => onDragStart(rowIndex, colIndex)}
                            onDragOver={() => onDragOver(rowIndex, colIndex)}
                        />
                    </div>,
                )
            }
        }

        return cells
    }, [
        visibleRows,
        visibleCols,
        data,
        rowHeights,
        columnWidths,
        activeCell,
        isCellSelected,
        onCellChange,
        onCellSelect,
        onDragStart,
        onDragOver,
    ])

    return (
        <div ref={gridRef} className="flex-1 overflow-auto relative" onMouseUp={onDragEnd}>
            <div className="absolute top-0 left-0 z-10 bg-gray-100 border-r border-b">
                {/* Top-left corner cell */}
                <div className="w-[40px] h-[24px] flex items-center justify-center bg-gray-100 border-b border-r"></div>
            </div>

            <div className="absolute top-0 left-[40px] z-10 flex bg-gray-100 border-b">
                {/* Column headers */}
                {columnHeaders}
            </div>

            <div className="absolute top-[24px] left-0 z-10 bg-gray-100 border-r">
                {/* Row headers */}
                {rowHeaders}
            </div>

            <div className="absolute top-[24px] left-[40px]" style={{ height: `${totalHeight}px`, width: `${totalWidth}px` }}>
                {/* Grid cells */}
                {visibleCells}
            </div>
        </div>
    )
}

