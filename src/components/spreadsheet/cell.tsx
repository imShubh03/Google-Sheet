"use client"

import type React from "react"
import { useState, useRef, useEffect, memo } from "react"
import type { CellStyle, ValidationError } from "@/lib/types"
import { validateCellValue } from "@/lib/validation"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface CellProps {
    value: string
    formula: string
    style: CellStyle
    dataType?: "text" | "number" | "date" | "boolean"
    validation?: {
        type: "text" | "number" | "date" | "boolean"
        required?: boolean
        min?: number
        max?: number
        pattern?: string
        list?: string[]
    }
    width: number
    isActive: boolean
    isSelected: boolean
    onChange: (value: string) => void
    onSelect: () => void
    onDragStart: () => void
    onDragOver: () => void
}

const Cell = memo(function Cell({
    value,
    formula,
    style,
    dataType,
    validation,
    width,
    isActive,
    isSelected,
    onChange,
    onSelect,
    onDragStart,
    onDragOver,
}: CellProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState("")
    const [error, setError] = useState<ValidationError | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Start editing when double-clicked
    const handleDoubleClick = () => {
        setIsEditing(true)
        setEditValue(formula || value)
    }

    // Handle cell selection
    const handleClick = () => {
        if (!isEditing) {
            onSelect()
        }
    }

    // Handle mouse down for drag operations
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) {
            // Left mouse button
            onSelect()
            onDragStart()
        }
    }

    // Handle mouse over for drag selection
    const handleMouseOver = (e: React.MouseEvent) => {
        if (e.buttons === 1) {
            // Left mouse button is pressed
            onDragOver()
        }
    }

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value)
        const validationResult = validateCellValue(e.target.value, dataType, validation)
        setError(validationResult.error)
    }

    // Handle input blur (finish editing)
    const handleInputBlur = () => {
        setIsEditing(false)
        if (!error || error.type === "warning") {
            onChange(editValue)
        }
    }

    // Handle key down events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setIsEditing(false)
            if (!error || error.type === "warning") {
                onChange(editValue)
            }
        } else if (e.key === "Escape") {
            setIsEditing(false)
            setEditValue(formula || value)
            setError(null)
        }
    }

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    // Apply cell styles
    const cellStyle = {
        width: `${width}px`,
        height: "100%",
        fontFamily: style.fontFamily || "Arial",
        fontSize: style.fontSize || "11px",
        fontWeight: style.fontWeight || "normal",
        fontStyle: style.fontStyle || "normal",
        color: error ? "red" : style.color || "black",
        backgroundColor: style.backgroundColor || (isSelected ? "#e8f0fe" : "white"),
        textAlign: style.textAlign || "left",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        padding: "0 4px",
        border: "1px solid #e0e0e0",
        borderTop: "none",
        borderLeft: "none",
        outline: isActive ? "2px solid #4285f4" : isSelected ? "1px solid #4285f4" : "none",
        zIndex: isActive ? 2 : 1,
    }

    const content = (
        <div
            className={cn("relative", error && "border-red-500")}
            style={cellStyle}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseOver={handleMouseOver}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type={dataType === "number" ? "number" : "text"}
                    value={editValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 w-full h-full border-0 p-0 px-1 outline-none"
                    style={{
                        fontFamily: style.fontFamily || "Arial",
                        fontSize: style.fontSize || "11px",
                    }}
                />
            ) : (
                <div
                    className="w-full h-full flex items-center"
                    style={{
                        justifyContent:
                            style.textAlign === "right" ? "flex-end" : style.textAlign === "center" ? "center" : "flex-start",
                    }}
                >
                    {value}
                </div>
            )}
        </div>
    )

    return error ? (
        <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent>
                <p className="text-sm text-red-500">{error.message}</p>
            </TooltipContent>
        </Tooltip>
    ) : (
        content
    )
})

export default Cell

