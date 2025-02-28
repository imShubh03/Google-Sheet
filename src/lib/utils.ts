import { twMerge } from "tailwind-merge"
import type { SpreadsheetData } from "./types"
import clsx, { ClassValue } from "clsx"

// Convert column index to letter (0 -> A, 1 -> B, etc.)
export function getColumnLabel(index: number): string {
    let label = ""
    let i = index

    while (i >= 0) {
        label = String.fromCharCode(65 + (i % 26)) + label
        i = Math.floor(i / 26) - 1
    }

    return label
}

// Convert cell reference to row and column indices (A1 -> {row: 0, col: 0})
export function parseCellReference(ref: string): { row: number; col: number } | null {
    const match = ref.match(/^([A-Z]+)(\d+)$/)
    if (!match) return null

    const colStr = match[1]
    const rowStr = match[2]

    let col = 0
    for (let i = 0; i < colStr.length; i++) {
        col = col * 26 + (colStr.charCodeAt(i) - 64)
    }

    return {
        row: Number.parseInt(rowStr) - 1,
        col: col - 1,
    }
}

// Get cell value from reference
export function getCellValue(ref: string, data: SpreadsheetData): any {
    const cellPos = parseCellReference(ref)
    if (!cellPos) return null

    const { row, col } = cellPos
    if (!data[row] || !data[row][col]) return null

    return data[row][col].value
}

// Initialize empty spreadsheet
export function initializeSpreadsheet(rows: number, cols: number): SpreadsheetData {
    const data: SpreadsheetData = {}

    for (let row = 0; row < rows; row++) {
        data[row] = {}
        for (let col = 0; col < cols; col++) {
            data[row][col] = { value: "", style: {} }
        }
    }

    return data
}

//This is already defined in cn.ts
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

