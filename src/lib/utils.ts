import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

import type { SpreadsheetData } from "./types"

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

// Trim whitespace from a string
export function trim(value: string): string {
    return value.trim()
}

// Convert string to uppercase
export function toUpper(value: string): string {
    return value.toUpperCase()
}

// Convert string to lowercase
export function toLower(value: string): string {
    return value.toLowerCase()
}

// Remove duplicate rows from a range
export function removeDuplicates(
    data: SpreadsheetData,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
): SpreadsheetData {
    const newData = { ...data }
    const seen = new Set()

    for (let row = startRow; row <= endRow; row++) {
        // Create a string representation of the row for comparison
        const rowStr = JSON.stringify(
            Array.from({ length: endCol - startCol + 1 }, (_, i) => data[row][startCol + i]?.value),
        )

        if (seen.has(rowStr)) {
            // Delete this row and shift all rows below up
            for (let r = row; r < Object.keys(data).length - 1; r++) {
                newData[r] = { ...newData[r + 1] }
            }

            // Delete the last row
            delete newData[Object.keys(newData).length - 1]

            // Adjust the end row since we removed a row
            endRow--
            row--
        } else {
            seen.add(rowStr)
        }
    }

    return newData
}

// Find and replace text in a range
export function findAndReplace(
    data: SpreadsheetData,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    findText: string,
    replaceText: string,
): SpreadsheetData {
    const newData = { ...data }

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const cell = newData[row][col]
            if (typeof cell.value === "string" && cell.value.includes(findText)) {
                cell.value = cell.value.replace(new RegExp(findText, "g"), replaceText)
            }
        }
    }

    return newData
}

