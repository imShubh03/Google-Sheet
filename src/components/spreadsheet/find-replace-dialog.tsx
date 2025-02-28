"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label" // Ensure this path is correct or update it to the correct module path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FindReplaceDialogProps {
    isOpen: boolean
    onClose: () => void
    onFind: (text: string) => void
    onReplace: (findText: string, replaceText: string) => void
    onReplaceAll: (findText: string, replaceText: string) => void
}

export default function FindReplaceDialog({
    isOpen,
    onClose,
    onFind,
    onReplace,
    onReplaceAll,
}: FindReplaceDialogProps) {
    const [findText, setFindText] = useState("")
    const [replaceText, setReplaceText] = useState("")

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Find and replace</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="find" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="find">Find</TabsTrigger>
                        <TabsTrigger value="replace">Replace</TabsTrigger>
                    </TabsList>
                    <TabsContent value="find" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="find">Find</Label>
                            <Input
                                id="find"
                                value={findText}
                                onChange={(e) => setFindText(e.target.value)}
                                placeholder="Enter text to find..."
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={() => onFind(findText)}>Find</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="replace" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="find-replace">Find</Label>
                            <Input
                                id="find-replace"
                                value={findText}
                                onChange={(e) => setFindText(e.target.value)}
                                placeholder="Enter text to find..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="replace">Replace with</Label>
                            <Input
                                id="replace"
                                value={replaceText}
                                onChange={(e) => setReplaceText(e.target.value)}
                                placeholder="Enter replacement text..."
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={() => onReplace(findText, replaceText)}>Replace</Button>
                            <Button onClick={() => onReplaceAll(findText, replaceText)}>Replace All</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

