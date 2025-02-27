import type { SpreadsheetData } from "./types";
import { parseCellReference, getCellValue } from "./utils";

// evaluate a formula in a spreadsheet cell
export function evaluateFormula(formula: string, data: SpreadsheetData): any {
    // if the formula does not start with "=", return it as a normal value
    if (!formula.startsWith("=")) return formula

    // remove the equals sign to extract the expression
    const expression = formula.substring(1)

    try {
        // check for built-in functions and evaluate accordingly
        if (expression.includes("SUM(")) {
            return evaluateSum(expression, data)
        } else if (expression.includes("AVERAGE(")) {
            return evaluateAverage(expression, data)
        } else if (expression.includes("MAX(")) {
            return evaluateMax(expression, data)
        } else if (expression.includes("MIN(")) {
            return evaluateMin(expression, data)
        } else if (expression.includes("COUNT(")) {
            return evaluateCount(expression, data)
        } else if (expression.includes("TRIM(")) {
            return evaluateTrim(expression, data)
        } else if (expression.includes("UPPER(")) {
            return evaluateUpper(expression, data)
        } else if (expression.includes("LOWER(")) {
            return evaluateLower(expression, data)
        } else {
            // for simple expressions, find all cell references in the formula
            const cellRefs = expression.match(/[A-Z]+\d+/g) || []
            let evalExpression = expression

            // replace cell references with their corresponding values
            for (const ref of cellRefs) {
                const value = getCellValue(ref, data)
                evalExpression = evalExpression.replace(ref, value !== null ? value.toString() : "0")
            }

            // evaluate the final mathematical expression
            return eval(evalExpression)
        }
    } catch (error) {
        // handle any errors that occur during evaluation
        console.error("Error evaluating formula:", error)
        return "#ERROR!"
    }
}


// Parse a range of cells and extract numeric values
export function parseRange(range: string, data: SpreadsheetData): any[] {
    // Split the range into start and end cell references
    const [start, end] = range.split(":")

    // Convert cell references to row and column indices
    const startPos = parseCellReference(start)
    const endPos = parseCellReference(end)

    // If parsing fails, return an empty array
    if (!startPos || !endPos) return []

    const values = []

    // Iterate through the rows and columns within the range
    for (let row = startPos.row; row <= endPos.row; row++) {
        for (let col = startPos.col; col <= endPos.col; col++) {
            // Check if the cell exists and contains a valid value
            if (data[row] && data[row][col] && data[row][col].value !== null && data[row][col].value !== "") {
                const value = data[row][col].value

                // Convert valid numeric values to numbers and add them to the array
                if (typeof value === "number" || !isNaN(Number(value))) {
                    values.push(Number(value))
                }
            }
        }
    }

    return values
}


// Evaluates SUM(A1:A5) by summing all values in the range
function evaluateSum(expression: string, data: SpreadsheetData): number {
    const rangeMatch = expression.match(/SUM\(([A-Z]+\d+:[A-Z]+\d+)\)/);
    if (!rangeMatch) return 0;

    const range = rangeMatch[1];
    const values = parseRange(range, data);

    return values.reduce((sum, value) => sum + value, 0);
}

// Evaluates AVERAGE(A1:A5) by computing the mean of all values in the range
function evaluateAverage(expression: string, data: SpreadsheetData): number {
    const rangeMatch = expression.match(/AVERAGE\(([A-Z]+\d+:[A-Z]+\d+)\)/);
    if (!rangeMatch) return 0;

    const range = rangeMatch[1];
    const values = parseRange(range, data);

    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Evaluates MAX(A1:A5) by finding the largest number in the range
function evaluateMax(expression: string, data: SpreadsheetData): number {
    const rangeMatch = expression.match(/MAX\(([A-Z]+\d+:[A-Z]+\d+)\)/);
    if (!rangeMatch) return 0;

    const range = rangeMatch[1];
    const values = parseRange(range, data);

    if (values.length === 0) return 0;
    return Math.max(...values);
}

// Evaluates MIN(A1:A5) by finding the smallest number in the range
function evaluateMin(expression: string, data: SpreadsheetData): number {
    const rangeMatch = expression.match(/MIN\(([A-Z]+\d+:[A-Z]+\d+)\)/);
    if (!rangeMatch) return 0;

    const range = rangeMatch[1];
    const values = parseRange(range, data);

    if (values.length === 0) return 0;
    return Math.min(...values);
}

// Evaluates COUNT(A1:A5) by counting the number of valid numerical values in the range
function evaluateCount(expression: string, data: SpreadsheetData): number {
    const rangeMatch = expression.match(/COUNT\(([A-Z]+\d+:[A-Z]+\d+)\)/);
    if (!rangeMatch) return 0;

    const range = rangeMatch[1];
    const values = parseRange(range, data);

    return values.length;
}

// Evaluates TRIM(A1) by removing leading/trailing spaces from the text in the specified cell
function evaluateTrim(expression: string, data: SpreadsheetData): string {
    const cellMatch = expression.match(/TRIM\(([A-Z]+\d+)\)/);
    if (!cellMatch) return "";

    const cell = cellMatch[1];
    const value = getCellValue(cell, data);

    if (typeof value !== "string") return value?.toString() || "";
    return value.trim();
}

// Evaluates UPPER(A1) by converting text in the specified cell to uppercase
function evaluateUpper(expression: string, data: SpreadsheetData): string {
    const cellMatch = expression.match(/UPPER\(([A-Z]+\d+)\)/);
    if (!cellMatch) return "";

    const cell = cellMatch[1];
    const value = getCellValue(cell, data);

    if (typeof value !== "string") return value?.toString() || "";
    return value.toUpperCase();
}

// Evaluates LOWER(A1) by converting text in the specified cell to lowercase
function evaluateLower(expression: string, data: SpreadsheetData): string {
    const cellMatch = expression.match(/LOWER\(([A-Z]+\d+)\)/);
    if (!cellMatch) return "";

    const cell = cellMatch[1];
    const value = getCellValue(cell, data);

    if (typeof value !== "string") return value?.toString() || "";
    return value.toLowerCase();
}
