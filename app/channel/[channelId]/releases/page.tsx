"use client"

import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { VideoCard } from "@/components/video-card"
import { notFound } from "next/navigation"
import type { Video as VideoType } from "@/types/game"

export default function ChannelReleasesPage({ params }: { params: { channelId: string } }) {
  const { gameState } = useGame()

  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)

  if (!channel) {
    notFound()
  }

  const releases = [...channel.videos]
    .filter((v) => !v.isProcessing && v.type === "release")
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} activeTab="releases" />

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Music Releases</h2>
        {releases.length === 0 ? (
          <p className="text-muted-foreground">No music releases yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {releases.map((video: VideoType) => (
              <VideoCard key={video.id} video={video} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
