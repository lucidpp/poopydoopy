"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { PlayerChannel, BaseChannel } from "@/types/game"
import Image from "next/image"

interface AboutChannelModalProps {
  isOpen: boolean
  onClose: () => void
  channel: PlayerChannel | BaseChannel
}

export function AboutChannelModal({ isOpen, onClose, channel }: AboutChannelModalProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const joinDate =
    channel.videos.length > 0
      ? channel.videos.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime())[0].uploadDate
      : new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
              <AvatarFallback className="text-2xl">{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{channel.name}</h2>
                {channel.isVerified && (
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YT_Official_Verified_Checkmark_Circle.svg-t9EM6UBaNAg2rqjLcalWIvpdcydKrL.png"
                    alt="Verified Badge"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                )}
              </div>
              <p className="text-muted-foreground">{channel.handle}</p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(channel.subscribers)} subscribers • {channel.videos.length} Puns
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{channel.bio}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Stats</h3>
              <div className="space-y-1 text-sm">
                <p>Joined: {formatDate(joinDate)}</p>
                <p>Total views: {formatNumber(channel.totalViews)}</p>
                <p>Subscribers: {formatNumber(channel.subscribers)}</p>
                <p>Videos: {channel.videos.length}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Links</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>No links provided</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
