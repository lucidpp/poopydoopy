// components/video-upload-modal.tsx
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useGame } from "@/components/game-provider"
import { useToast } from "@/components/ui/use-toast"

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoUploadModal({ isOpen, onClose }: VideoUploadModalProps) {
  const { addVideo } = useGame()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = () => {
    if (!title.trim() || !description.trim() || !thumbnail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all video details (Title, Description, Thumbnail URL).",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    addVideo({
      title,
      description,
      thumbnail: thumbnail.startsWith("http")
        ? thumbnail
        : `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(thumbnail)}`,
    })

    toast({
      title: "Video Uploading...",
      description: `"${title}" is being processed. It will appear on your channel shortly.`,
    })

    // Simulate upload/processing time
    setTimeout(() => {
      setTitle("")
      setDescription("")
      setThumbnail("")
      setIsUploading(false)
      onClose()
      toast({
        title: "Video Uploaded!",
        description: `"${title}" is now live on your channel!`,
      })
    }, 3000) // 3 seconds processing time
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>Fill in the details for your new rap masterpiece.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="My Hottest Rap Track"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Tell your fans about this track..."
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="thumbnail" className="text-right">
              Thumbnail Query
            </label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'rapper on stage' or 'abstract art'"
              disabled={isUploading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
