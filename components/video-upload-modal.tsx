"use client"

import type React from "react"

import { useState } from "react"
import { useGame } from "@/components/game-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Upload, FileVideo, Music } from "lucide-react"

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoUploadModal({ isOpen, onClose }: VideoUploadModalProps) {
  const { addVideo } = useGame()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"video" | "release">("video")
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [thumbnail, setThumbnail] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const qualityLabels = {
    1: "Poor",
    2: "Standard",
    3: "Good",
    4: "Great",
    5: "Masterpiece",
  }

  const qualityColors = {
    1: "destructive",
    2: "secondary",
    3: "default",
    4: "default",
    5: "default",
  } as const

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsUploading(true)

    // Generate a random thumbnail if none provided
    const finalThumbnail = thumbnail || `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(title)}`

    addVideo({
      title: title.trim(),
      description: description.trim(),
      thumbnail: finalThumbnail,
      type,
      quality,
      initialViews: 0, // Will be calculated in addVideo
      initialLikes: 0, // Will be calculated in addVideo
      initialDislikes: 0, // Will be calculated in addVideo
      totalComments: [], // Will be generated in addVideo
    })

    // Reset form
    setTitle("")
    setDescription("")
    setType("video")
    setQuality(3)
    setThumbnail("")
    setIsUploading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Pun
          </DialogTitle>
          <DialogDescription>Create and upload your latest rap masterpiece to PUNSTA</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter your pun title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your pun..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={type} onValueChange={(value: "video" | "release") => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <FileVideo className="h-4 w-4" />
                      Video Pun
                    </div>
                  </SelectItem>
                  <SelectItem value="release">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Music Release
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality Level</Label>
              <Select
                value={quality.toString()}
                onValueChange={(value) => setQuality(Number.parseInt(value) as 1 | 2 | 3 | 4 | 5)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(qualityLabels).map(([level, label]) => (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        <Badge variant={qualityColors[Number.parseInt(level) as keyof typeof qualityColors]}>
                          {label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnail"
              placeholder="https://example.com/thumbnail.jpg"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              type="url"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isUploading}>
              {isUploading ? "Uploading..." : "Upload Pun"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
