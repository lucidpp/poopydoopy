// components/content-upload-modal.tsx
"use client"

import type React from "react"

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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { Video } from "@/types/game"

interface ContentUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContentUploadModal({ isOpen, onClose }: ContentUploadModalProps) {
  const { addVideo } = useGame()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [contentType, setContentType] = useState<Video["type"]>("video") // Default to video
  const [quality, setQuality] = useState<Video["quality"]>(3) // Default to Good (3)
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // For MP4 upload
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const qualityLabels: { [key: number]: string } = {
    1: "Poor",
    2: "Standard",
    3: "Good",
    4: "Great",
    5: "Masterpiece",
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleUpload = () => {
    if (!title.trim() || !description.trim() || !thumbnail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all content details (Title, Description, Thumbnail Query).",
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
      type: contentType,
      quality: quality,
      videoFileName: selectedFile?.name, // Pass file name
      videoFileSize: selectedFile?.size, // Pass file size
    })

    toast({
      title: `${contentType === "video" ? "Pun" : "Release"} Uploading...`, // Renamed text
      description: `"${title}" is being processed. It will appear on your Punster Profile shortly.`, // Renamed text
    })

    setTimeout(() => {
      setTitle("")
      setDescription("")
      setThumbnail("")
      setContentType("video")
      setQuality(3)
      setSelectedFile(null) // Clear selected file
      setIsUploading(false)
      onClose()
      toast({
        title: `${contentType === "video" ? "Pun" : "Release"} Uploaded!`, // Renamed text
        description: `"${title}" is now live on your Punster Profile!`, // Renamed text
      })
    }, 3000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Content</DialogTitle>
          <DialogDescription>Create your next hit Pun or release a new track!</DialogDescription> {/* Renamed text */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
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
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
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
            <Label htmlFor="thumbnail" className="text-right">
              Thumbnail Query
            </Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'rapper on stage' or 'abstract art'"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mp4-upload" className="text-right">
              Upload MP4 (Simulated)
            </Label>
            <Input
              id="mp4-upload"
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="col-span-3"
              disabled={isUploading}
            />
          </div>
          {selectedFile && (
            <div className="col-span-4 text-center text-sm text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              <p className="text-xs text-orange-400 mt-1">
                Note: Actual video file is not stored due to browser limitations in this simulation environment. Only
                its metadata is saved.
              </p>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Content Type</Label>
            <RadioGroup
              value={contentType}
              onValueChange={(value: Video["type"]) => setContentType(value)}
              className="col-span-3 flex gap-4"
              disabled={isUploading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="type-video" />
                <Label htmlFor="type-video">Pun</Label> {/* Renamed text */}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="release" id="type-release" />
                <Label htmlFor="type-release">Release</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quality" className="text-right">
              Quality
            </Label>
            <div className="col-span-3 flex items-center gap-4">
              <Slider
                id="quality"
                min={1}
                max={5}
                step={1}
                value={[quality]}
                onValueChange={(val) => setQuality(val[0] as Video["quality"])}
                className="w-[calc(100%-60px)]"
                disabled={isUploading}
              />
              <span className="w-16 text-right text-sm font-medium">{qualityLabels[quality]}</span>
            </div>
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
