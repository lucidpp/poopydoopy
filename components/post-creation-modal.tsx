// components/post-creation-modal.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useGame } from "@/components/game-provider"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

interface PostCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PostCreationModal({ isOpen, onClose }: PostCreationModalProps) {
  const { addPost } = useGame()
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const { toast } = useToast()

  const handlePost = () => {
    if (!content.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting.",
        variant: "destructive",
      })
      return
    }

    setIsPosting(true)
    addPost(content)

    toast({
      title: "Post Created!",
      description: "Your update has been shared with your community.",
    })

    setTimeout(() => {
      setContent("")
      setIsPosting(false)
      onClose()
    }, 500) // Simulate quick post
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Community Post</DialogTitle>
          <DialogDescription>Share an update, ask a question, or connect with your fans.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="post-content" className="text-right">
              Content
            </Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="What's on your mind?"
              disabled={isPosting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={isPosting}>
            Cancel
          </Button>
          <Button onClick={handlePost} disabled={isPosting}>
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
