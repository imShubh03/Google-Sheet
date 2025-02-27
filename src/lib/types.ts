export interface CellStyle {
    // defines the styling properties for a spreadsheet cell
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    fontStyle?: string
    color?: string
    backgroundColor?: string
    textAlign?: "left" | "center" | "right"
    verticalAlign?: "top" | "middle" | "bottom"
    border?: string
    borderTop?: string
    borderRight?: string
    borderBottom?: string
    borderLeft?: string
}

export interface Cell {
    // represents a single cell in the spreadsheet with value, formula, and style
    value?: string | number | boolean | null
    formula?: string | null
    style?: CellStyle
}

export interface CellPosition {
    // defines the position of a cell using row and column indices
    row: number
    col: number
}

export type SpreadsheetData = Record<number, Record<number, Cell>>
// represents the entire spreadsheet as a nested object where each row and column index maps to a cell


