"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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

    // Check if a cell is in the selected range
    const isCellSelected = (row: number, col: number) => {
        if (!selectedRange) return false

        const startRow = Math.min(selectedRange.start.row, selectedRange.end.row)
        const endRow = Math.max(selectedRange.start.row, selectedRange.end.row)
        const startCol = Math.min(selectedRange.start.col, selectedRange.end.col)
        const endCol = Math.max(selectedRange.start.col, selectedRange.end.col)

        return row >= startRow && row <= endRow && col >= startCol && col <= endCol
    }

    // Handle column resize start
    const handleColumnResizeStart = (col: number, e: React.MouseEvent) => {
        e.preventDefault()
        setResizingColumn(col)
        setStartResizePos(e.clientX)
        setStartSize(columnWidths[col] || 100)

        document.addEventListener("mousemove", handleColumnResizeMove)
        document.addEventListener("mouseup", handleColumnResizeEnd)
    }

    // Handle column resize move
    const handleColumnResizeMove = (e: MouseEvent) => {
        if (resizingColumn === null) return

        const diff = e.clientX - startResizePos
        const newWidth = Math.max(50, startSize + diff)

        setColumnWidths((prev) => ({
            ...prev,
            [resizingColumn]: newWidth,
        }))
    }

    // Handle column resize end
    const handleColumnResizeEnd = () => {
        setResizingColumn(null)
        document.removeEventListener("mousemove", handleColumnResizeMove)
        document.removeEventListener("mouseup", handleColumnResizeEnd)
    }

    // Handle row resize start
    const handleRowResizeStart = (row: number, e: React.MouseEvent) => {
        e.preventDefault()
        setResizingRow(row)
        setStartResizePos(e.clientY)
        setStartSize(rowHeights[row] || 24)

        document.addEventListener("mousemove", handleRowResizeMove)
        document.addEventListener("mouseup", handleRowResizeEnd)
    }

    // Handle row resize move
    const handleRowResizeMove = (e: MouseEvent) => {
        if (resizingRow === null) return

        const diff = e.clientY - startResizePos
        const newHeight = Math.max(20, startSize + diff)

        setRowHeights((prev) => ({
            ...prev,
            [resizingRow]: newHeight,
        }))
    }

    // Handle row resize end
    const handleRowResizeEnd = () => {
        setResizingRow(null)
        document.removeEventListener("mousemove", handleRowResizeMove)
        document.removeEventListener("mouseup", handleRowResizeEnd)
    }

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleColumnResizeMove)
            document.removeEventListener("mouseup", handleColumnResizeEnd)
            document.removeEventListener("mousemove", handleRowResizeMove)
            document.removeEventListener("mouseup", handleRowResizeEnd)
        }
    }, [handleColumnResizeMove, handleColumnResizeEnd, handleRowResizeMove, handleRowResizeEnd])

    return (
        <div ref={gridRef} className="flex-1 overflow-auto relative" onMouseUp={onDragEnd}>
            <div className="absolute top-0 left-0 z-10 bg-gray-100 border-r border-b">
                {/* Top-left corner cell */}
                <div className="w-[40px] h-[24px] flex items-center justify-center bg-gray-100 border-b border-r"></div>
            </div>

            <div className="absolute top-0 left-[40px] z-10 flex bg-gray-100 border-b">
                {/* Column headers */}
                {Object.keys(data[0] || {}).map((col, index) => (
                    <div
                        key={`col-${index}`}
                        className="relative flex items-center justify-center border-r bg-gray-100 select-none"
                        style={{
                            width: `${columnWidths[index] || 100}px`,
                            height: "24px",
                        }}
                    >
                        {getColumnLabel(index)}
                        <div
                            className="absolute top-0 right-0 w-1 h-full cursor-col-resize"
                            onMouseDown={(e) => handleColumnResizeStart(index, e)}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute top-[24px] left-0 z-10 bg-gray-100 border-r">
                {/* Row headers */}
                {Object.keys(data).map((row, index) => (
                    <div
                        key={`row-${index}`}
                        className="relative flex items-center justify-center border-b bg-gray-100 select-none"
                        style={{
                            width: "40px",
                            height: `${rowHeights[index] || 24}px`,
                        }}
                    >
                        {index + 1}
                        <div
                            className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize"
                            onMouseDown={(e) => handleRowResizeStart(index, e)}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute top-[24px] left-[40px]">
                {/* Grid cells */}
                <div className="grid">
                    {Object.keys(data).map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex" style={{ height: `${rowHeights[rowIndex] || 24}px` }}>
                            {Object.keys(data[rowIndex]).map((col, colIndex) => (
                                <Cell
                                    key={`cell-${rowIndex}-${colIndex}`}
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
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

