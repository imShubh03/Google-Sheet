"use client"

import { Share, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
    onUndo: () => void
    onRedo: () => void
    onCut: () => void
    onCopy: () => void
    onPaste: () => void
    onFind: () => void
    onFindAndReplace: () => void
}

export default function Header({ onUndo, onRedo, onCut, onCopy, onPaste, onFind, onFindAndReplace }: HeaderProps) {
    return (
        <div className="flex items-center p-2 border-b bg-white">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                        <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Untitled spreadsheet</span>
                    <div className="flex text-xs text-gray-500 gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 px-1 rounded">File</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem>New</DropdownMenuItem>
                                <DropdownMenuItem>Open...</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                                <DropdownMenuItem>Download</DropdownMenuItem>
                                <DropdownMenuItem>Email as attachment</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Share</DropdownMenuItem>
                                <DropdownMenuItem>Publish to web</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Print</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 px-1 rounded">Edit</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem onClick={onUndo}>
                                    Undo
                                    <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onRedo}>
                                    Redo
                                    <DropdownMenuShortcut>⌘Y</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onCut}>
                                    Cut
                                    <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onCopy}>
                                    Copy
                                    <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onPaste}>
                                    Paste
                                    <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onFind}>
                                    Find
                                    <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onFindAndReplace}>
                                    Find and replace
                                    <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 px-1 rounded">View</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem>Freeze</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Formulas</DropdownMenuItem>
                                <DropdownMenuItem>Gridlines</DropdownMenuItem>
                                <DropdownMenuItem>Protected ranges</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Full screen</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button className="hover:bg-gray-100 px-1 rounded">Insert</button>
                        <button className="hover:bg-gray-100 px-1 rounded">Format</button>
                        <button className="hover:bg-gray-100 px-1 rounded">Data</button>
                        <button className="hover:bg-gray-100 px-1 rounded">Tools</button>
                        <button className="hover:bg-gray-100 px-1 rounded">Extensions</button>
                        <button className="hover:bg-gray-100 px-1 rounded">Help</button>
                    </div>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100">
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                </Button>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">U</div>
            </div>
        </div>
    )
}

