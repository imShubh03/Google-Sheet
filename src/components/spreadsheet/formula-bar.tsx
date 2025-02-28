"use client"

import type { KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { ActivityIcon as Function } from "lucide-react"

interface FormulaBarProps {
    value: string
    onChange: (value: string) => void
    onSubmit: (value: string) => void
    activeCellLabel: string
}

export default function FormulaBar({ value, onChange, onSubmit, activeCellLabel }: FormulaBarProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSubmit(value)
        }
    }

    return (
        <div className="flex items-center p-1 border-b bg-white">
            <div className="flex items-center justify-center h-8 w-8 mr-1">
                <Function className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center border rounded h-8 mr-2 px-2 min-w-[60px] text-sm">
                {activeCellLabel || "A1"}
            </div>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => onSubmit(value)}
                className="h-8 border-gray-300 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter a value or formula (start with =)"
            />
        </div>
    )
}

