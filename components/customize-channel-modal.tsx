"use client"

import { useState } from "react"
import { useGame } from "@/components/game-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { PlayerChannel } from "@/types/game"
import { GripVertical } from "lucide-react"

interface CustomizeChannelModalProps {
  isOpen: boolean
  onClose: () => void
  channel: PlayerChannel
}

export function CustomizeChannelModal({ isOpen, onClose, channel }: CustomizeChannelModalProps) {
  const { setGameState } = useGame()
  const [name, setName] = useState(channel.name)
  const [bio, setBio] = useState(channel.bio)
  const [avatar, setAvatar] = useState(channel.avatar)
  const [banner, setBanner] = useState(channel.banner)
  const [homepageLayout, setHomepageLayout] = useState(
    channel.homepageLayout || ["latestVideos", "popularVideos", "playlists"],
  )

  const sectionLabels = {
    latestVideos: "Latest Uploads",
    popularVideos: "Popular Uploads",
    playlists: "Playlists",
  }

  const handleSave = () => {
    setGameState((prev) => ({
      ...prev,
      channel: {
        ...prev.channel,
        name: name.trim() || channel.name,
        bio: bio.trim(),
        avatar: avatar.trim() || channel.avatar,
        banner: banner.trim() || channel.banner,
        homepageLayout,
        handle: `@${(name.trim() || channel.name).replace(/\s/g, "")}Official`,
      },
    }))
    onClose()
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(homepageLayout)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setHomepageLayout(items)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Punster Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Channel Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your channel name" />
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                  <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{name || "Channel Name"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about your channel..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner URL</Label>
            <Input
              id="banner"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              type="url"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Homepage Layout</CardTitle>
              <p className="text-sm text-muted-foreground">
                Drag and drop to reorder sections on your channel homepage
              </p>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="homepage-sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {homepageLayout.map((sectionId, index) => (
                        <Draggable key={sectionId} draggableId={sectionId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-2 p-3 border rounded-lg bg-background"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span>{sectionLabels[sectionId as keyof typeof sectionLabels]}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
