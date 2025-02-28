import type { SpreadsheetData } from "./types"
import { parseCellReference, getCellValue } from "./utils"

// Evaluate a formula
export function evaluateFormula(formula: string, data: SpreadsheetData): any {
    if (!formula.startsWith("=")) return formula

    // Remove the equals sign
    const expression = formula.substring(1).trim()

    try {
        // Check for built-in functions
        if (expression.startsWith("SUM(")) {
            return evaluateSum(expression, data)
        } else if (expression.startsWith("AVERAGE(")) {
            return evaluateAverage(expression, data)
        } else if (expression.startsWith("MAX(")) {
            return evaluateMax(expression, data)
        } else if (expression.startsWith("MIN(")) {
            return evaluateMin(expression, data)
        } else if (expression.startsWith("COUNT(")) {
            return evaluateCount(expression, data)
        } else if (expression.startsWith("TRIM(")) {
            return evaluateTrim(expression, data)
        } else if (expression.startsWith("UPPER(")) {
            return evaluateUpper(expression, data)
        } else if (expression.startsWith("LOWER(")) {
            return evaluateLower(expression, data)
        } else {
            // For simple expressions, replace cell references with values
            const cellRefs = expression.match(/[A-Z]+\d+/g) || []
            let evalExpression = expression

            for (const ref of cellRefs) {
                const value = getCellValue(ref, data)
                evalExpression = evalExpression.replace(ref, value !== null ? value.toString() : "0")
            }

            // Evaluate the expression
            return evaluateExpression(evalExpression)
        }
    } catch (error) {
        console.error("Error evaluating formula:", error)
        return "#ERROR!"
    }
}

// Safely evaluate mathematical expressions
function evaluateExpression(expression: string): number {
    // Remove any unsafe characters
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, "")

    try {
        // Use Function instead of eval for better security
        return new Function(`return ${sanitized}`)()
    } catch {
        throw new Error("Invalid expression")
    }
}

// Parse a range (e.g., A1:B3) into an array of cell values
function parseRange(range: string, data: SpreadsheetData): any[] {
    const [start, end] = range.split(":")
    const startPos = parseCellReference(start)
    const endPos = parseCellReference(end)

    if (!startPos || !endPos) return []

    const values = []

    for (let row = startPos.row; row <= endPos.row; row++) {
        for (let col = startPos.col; col <= endPos.col; col++) {
            if (data[row] && data[row][col] && data[row][col].value !== null && data[row][col].value !== "") {
                const value = data[row][col].value
                if (typeof value === "number" || !isNaN(Number(value))) {
                    values.push(Number(value))
                }
            }
        }
    }

    return values
}

// Extract range from function argument
function extractRange(expression: string): string {
    const match = expression.match(/$$(.*?)$$/)
    return match ? match[1].trim() : ""
}

// Mathematical Functions

function evaluateSum(expression: string, data: SpreadsheetData): number {
    const range = extractRange(expression)
    const values = parseRange(range, data)
    return values.reduce((sum, value) => sum + value, 0)
}

function evaluateAverage(expression: string, data: SpreadsheetData): number {
    const range = extractRange(expression)
    const values = parseRange(range, data)
    if (values.length === 0) return 0
    return values.reduce((sum, value) => sum + value, 0) / values.length
}

function evaluateMax(expression: string, data: SpreadsheetData): number {
    const range = extractRange(expression)
    const values = parseRange(range, data)
    if (values.length === 0) return 0
    return Math.max(...values)
}

function evaluateMin(expression: string, data: SpreadsheetData): number {
    const range = extractRange(expression)
    const values = parseRange(range, data)
    if (values.length === 0) return 0
    return Math.min(...values)
}

function evaluateCount(expression: string, data: SpreadsheetData): number {
    const range = extractRange(expression)
    const values = parseRange(range, data)
    return values.length
}

// Data Quality Functions

function evaluateTrim(expression: string, data: SpreadsheetData): string {
    const cellRef = extractRange(expression)
    const value = getCellValue(cellRef, data)
    if (typeof value !== "string") return value?.toString() || ""
    return value.trim()
}

function evaluateUpper(expression: string, data: SpreadsheetData): string {
    const cellRef = extractRange(expression)
    const value = getCellValue(cellRef, data)
    if (typeof value !== "string") return value?.toString() || ""
    return value.toUpperCase()
}

function evaluateLower(expression: string, data: SpreadsheetData): string {
    const cellRef = extractRange(expression)
    const value = getCellValue(cellRef, data)
    if (typeof value !== "string") return value?.toString() || ""
    return value.toLowerCase()
}

// Export utility functions for testing
export const utils = {
    evaluateExpression,
    parseRange,
    extractRange,
}

