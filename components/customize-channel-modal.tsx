"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useGame } from "@/components/game-provider"
import type { PlayerChannel } from "@/types/game"

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

  const handleSave = () => {
    setGameState((prev) => ({
      ...prev,
      channel: {
        ...prev.channel,
        name,
        bio,
        avatar,
        banner,
        handle: `@${name.replace(/\s/g, "")}Official`,
      },
    }))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Punster Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Channel Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter channel name" />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your audience about your channel"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Enter avatar image URL"
            />
          </div>

          <div>
            <Label htmlFor="banner">Banner URL</Label>
            <Input
              id="banner"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="Enter banner image URL"
            />
          </div>

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
