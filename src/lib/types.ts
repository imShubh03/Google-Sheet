export interface CellStyle {
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
    value?: string | number | boolean | null
    formula?: string | null
    style?: CellStyle
    dataType?: "text" | "number" | "date" | "boolean"
    validation?: {
        type: "text" | "number" | "date" | "boolean"
        required?: boolean
        min?: number
        max?: number
        pattern?: string
        list?: string[]
    }
}

export interface CellPosition {
    row: number
    col: number
}

export type SpreadsheetData = Record<number, Record<number, Cell>>

export interface ValidationError {
    message: string
    type: "error" | "warning"
}

