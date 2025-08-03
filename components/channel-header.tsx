"use client"

import type { PlayerChannel, BaseChannel } from "@/types/game"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { AboutChannelModal } from "./about-channel-modal"
import { SettingsIcon } from "lucide-react"
import { CustomizeChannelModal } from "./customize-channel-modal"
import { useGame } from "@/components/game-provider"

interface ChannelHeaderProps {
  channel: PlayerChannel | BaseChannel
  activeTab: "home" | "videos" | "playlists" | "about" | "posts" | "releases"
}

export function ChannelHeader({ channel, activeTab }: ChannelHeaderProps) {
  const { gameState } = useGame()
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false)

  const isPlayerChannel = channel.id === gameState.channel.id

  const formatSubscribers = (subscribers: number) => {
    if (subscribers >= 1000000) {
      return `${(subscribers / 1000000).toFixed(1)}M`
    }
    if (subscribers >= 1000) {
      return `${(subscribers / 1000).toFixed(0)}K`
    }
    return subscribers.toString()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <img
          src={channel.banner || "/placeholder.svg"}
          alt={`${channel.name} banner`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 px-4">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 -mt-12 sm:-mt-16 border-4 border-background">
          <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
          <AvatarFallback className="text-4xl">{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{channel.name}</h1>
            {channel.isVerified && (
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YT_Official_Verified_Checkmark_Circle.svg-t9EM6UBaNAg2rqjLcalWIvpdcydKrL.png"
                alt="Verified Badge"
                width={20}
                height={20}
                className="w-5 h-5 mt-1"
              />
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {channel.handle} • {formatSubscribers(channel.subscribers)} subscribers • {channel.videos.length} Puns
          </p>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary hover:bg-transparent px-0 py-0 h-auto inline-flex items-center mt-2"
            onClick={() => setIsAboutModalOpen(true)}
          >
            <span className="text-sm font-medium">More about this Punster Profile</span>
          </Button>
          {!isPlayerChannel && (
            <Button variant="secondary" className="mt-2 sm:ml-4">
              Subscribe
            </Button>
          )}
          {isPlayerChannel && (
            <Button variant="ghost" size="icon" className="mt-2 sm:ml-2" onClick={() => setIsCustomizeModalOpen(true)}>
              <SettingsIcon className="h-5 w-5" />
              <span className="sr-only">Customize Punster Profile</span>
            </Button>
          )}
        </div>
      </div>
      <AboutChannelModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} channel={channel} />
      {isPlayerChannel && (
        <CustomizeChannelModal
          isOpen={isCustomizeModalOpen}
          onClose={() => setIsCustomizeModalOpen(false)}
          channel={channel as PlayerChannel}
        />
      )}
    </div>
  )
}
