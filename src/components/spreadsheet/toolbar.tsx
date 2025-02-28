"use client"

import { useState } from "react"
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Minus,
    Percent,
    DollarSign,
    ChevronDown,
    Type,
    PaintBucket,
    Link,
    MoreHorizontal,
    Search,
    Undo,
    Redo,
    Printer,
    Save,
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
            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Redo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Printer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Save className="h-4 w-4" />
                </Button>

                <div className="h-6 w-px bg-gray-300 mx-1" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                            100% <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>50%</DropdownMenuItem>
                        <DropdownMenuItem>75%</DropdownMenuItem>
                        <DropdownMenuItem>100%</DropdownMenuItem>
                        <DropdownMenuItem>125%</DropdownMenuItem>
                        <DropdownMenuItem>150%</DropdownMenuItem>
                        <DropdownMenuItem>200%</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-6 w-px bg-gray-300 mx-1" />

                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Percent className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <span className="text-xs">.00</span>
                </Button>

                <div className="h-6 w-px bg-gray-300 mx-1" />
            </div>

            <div className="flex items-center space-x-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 min-w-[100px] justify-between text-gray-600">
                            {fontFamily} <ChevronDown className="ml-1 h-3 w-3" />
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
                        <Button variant="ghost" size="sm" className="h-8 px-2 min-w-[50px] justify-between text-gray-600">
                            {fontSize} <ChevronDown className="ml-1 h-3 w-3" />
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

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                    onClick={() => onApplyStyle({ fontWeight: "bold" })}
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                    onClick={() => onApplyStyle({ fontStyle: "italic" })}
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Underline className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <Link className="h-4 w-4" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
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

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                    onClick={() => onApplyStyle({ textAlign: "left" })}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                    onClick={() => onApplyStyle({ textAlign: "center" })}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                    onClick={() => onApplyStyle({ textAlign: "right" })}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

