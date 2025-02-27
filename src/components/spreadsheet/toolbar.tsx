"use client"

import { useState } from "react"
import {
    Bold,
    Italic,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Plus,
    Trash2,
    ChevronDown,
    Type,
    PaintBucket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { CellStyle } from "@/lib/types"

interface ToolbarProps {
    onApplyStyle: (style: Partial<CellStyle>) => void
    onAddRow: () => void
    onDeleteRow: () => void
    onAddColumn: () => void
    onDeleteColumn: () => void
}

export default function Toolbar({ onApplyStyle, onAddRow, onDeleteRow, onAddColumn, onDeleteColumn }: ToolbarProps) {
    const [fontFamily, setFontFamily] = useState("Arial")
    const [fontSize, setFontSize] = useState("11")

    const fontFamilies = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia"]
    const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36"]
    const colors = [
        "#000000",
        "#434343",
        "#666666",
        "#999999",
        "#b7b7b7",
        "#cccccc",
        "#d9d9d9",
        "#efefef",
        "#f3f3f3",
        "#ffffff",
        "#980000",
        "#ff0000",
        "#ff9900",
        "#ffff00",
        "#00ff00",
        "#00ffff",
        "#4a86e8",
        "#0000ff",
        "#9900ff",
        "#ff00ff",
    ]

    return (
        <div className="flex items-center p-1 border-b bg-white">
            <div className="flex items-center space-x-1 mr-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            File <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>New</DropdownMenuItem>
                        <DropdownMenuItem>Open</DropdownMenuItem>
                        <DropdownMenuItem>Save</DropdownMenuItem>
                        <DropdownMenuItem>Download as CSV</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            Edit <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Undo</DropdownMenuItem>
                        <DropdownMenuItem>Redo</DropdownMenuItem>
                        <DropdownMenuItem>Cut</DropdownMenuItem>
                        <DropdownMenuItem>Copy</DropdownMenuItem>
                        <DropdownMenuItem>Paste</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            View <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Freeze rows</DropdownMenuItem>
                        <DropdownMenuItem>Freeze columns</DropdownMenuItem>
                        <DropdownMenuItem>Gridlines</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            Insert <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={onAddRow}>Row</DropdownMenuItem>
                        <DropdownMenuItem onClick={onAddColumn}>Column</DropdownMenuItem>
                        <DropdownMenuItem>Chart</DropdownMenuItem>
                        <DropdownMenuItem>Function</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            Format <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Number format</DropdownMenuItem>
                        <DropdownMenuItem>Conditional formatting</DropdownMenuItem>
                        <DropdownMenuItem>Alternating colors</DropdownMenuItem>
                        <DropdownMenuItem>Clear formatting</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            Data <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Sort range</DropdownMenuItem>
                        <DropdownMenuItem>Create filter</DropdownMenuItem>
                        <DropdownMenuItem>Remove duplicates</DropdownMenuItem>
                        <DropdownMenuItem>Data validation</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <div className="flex items-center space-x-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 min-w-[100px] justify-between">
                            {fontFamily} <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {fontFamilies.map((font) => (
                            <DropdownMenuItem
                                key={font}
                                onClick={() => {
                                    setFontFamily(font)
                                    onApplyStyle({ fontFamily: font })
                                }}
                            >
                                {font}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 min-w-[60px] justify-between">
                            {fontSize} <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {fontSizes.map((size) => (
                            <DropdownMenuItem
                                key={size}
                                onClick={() => {
                                    setFontSize(size)
                                    onApplyStyle({ fontSize: `${size}px` })
                                }}
                            >
                                {size}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onApplyStyle({ fontWeight: "bold" })}>
                    <Bold className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onApplyStyle({ fontStyle: "italic" })}>
                    <Italic className="h-4 w-4" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Type className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                        <div className="grid grid-cols-10 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className="h-6 w-6 rounded-sm border border-gray-300"
                                    style={{ backgroundColor: color }}
                                    onClick={() => onApplyStyle({ color })}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <PaintBucket className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                        <div className="grid grid-cols-10 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className="h-6 w-6 rounded-sm border border-gray-300"
                                    style={{ backgroundColor: color }}
                                    onClick={() => onApplyStyle({ backgroundColor: color })}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onApplyStyle({ textAlign: "left" })}>
                    <AlignLeft className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onApplyStyle({ textAlign: "center" })}>
                    <AlignCenter className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onApplyStyle({ textAlign: "right" })}>
                    <AlignRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddRow}>
                    <Plus className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDeleteRow}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

