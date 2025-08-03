// components/playlist-creation-modal.tsx
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PlaylistCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PlaylistCreationModal({ isOpen, onClose }: PlaylistCreationModalProps) {
  const { gameState, addPlaylist } = useGame()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([])
  const { toast } = useToast()

  const handleCreatePlaylist = () => {
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a title for your playlist.",
        variant: "destructive",
      })
      return
    }
    if (selectedVideoIds.length === 0) {
      toast({
        title: "No Puns Selected", // Renamed text
        description: "Please select at least one Pun for your playlist.", // Renamed text
        variant: "destructive",
      })
      return
    }

    addPlaylist({
      title,
      description,
      videoIds: selectedVideoIds,
    })

    toast({
      title: "Playlist Created!",
      description: `Your playlist "${title}" has been created.`,
    })

    setTitle("")
    setDescription("")
    setSelectedVideoIds([])
    onClose()
  }

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    setSelectedVideoIds((prev) => (checked ? [...prev, videoId] : prev.filter((id) => id !== videoId)))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>Organize your rap Puns into a collection.</DialogDescription> {/* Renamed text */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playlist-title" className="text-right">
              Title
            </Label>
            <Input
              id="playlist-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="My Hottest Tracks"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playlist-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="A collection of my best rap songs."
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Add Puns</Label> {/* Renamed text */}
            <ScrollArea className="col-span-3 h-40 w-full rounded-md border p-4">
              {gameState.channel.videos.length === 0 ? (
                <p className="text-muted-foreground">No Puns uploaded yet.</p> // Renamed text
              ) : (
                gameState.channel.videos.map((video) => (
                  <div key={video.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`video-${video.id}`}
                      checked={selectedVideoIds.includes(video.id)}
                      onCheckedChange={(checked) => handleVideoSelect(video.id, !!checked)}
                    />
                    <Label
                      htmlFor={`video-${video.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {video.title}
                    </Label>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
