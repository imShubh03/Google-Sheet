"use client"
import { Plus, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SheetTabsProps {
    sheets: string[]
    activeSheet: string
    onSheetChange: (sheet: string) => void
    onAddSheet: () => void
}

export default function SheetTabs({ sheets, activeSheet, onSheetChange, onAddSheet }: SheetTabsProps) {
    return (
        <div className="flex items-center h-8 bg-gray-100 border-t">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex h-full">
                {sheets.map((sheet) => (
                    <button
                        key={sheet}
                        className={`px-4 h-full flex items-center text-sm ${activeSheet === sheet
                                ? "bg-white border-t border-l border-r border-gray-300 font-medium text-green-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        onClick={() => onSheetChange(sheet)}
                    >
                        {sheet}
                    </button>
                ))}
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={onAddSheet}>
                <Plus className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
    )
}

