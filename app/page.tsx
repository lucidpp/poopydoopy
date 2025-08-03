"use client"

import { useGame } from "@/components/game-provider"
import { GameSetup } from "@/components/game-setup"
import { VideoCard } from "@/components/video-card"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  const { gameState } = useGame()

  if (!gameState.isGameStarted) {
    return <GameSetup />
  }

  // Get all videos from all channels
  const allVideos = [...gameState.channel.videos, ...gameState.otherChannels.flatMap((channel) => channel.videos)]
    .filter((video) => !video.isProcessing)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

  const getChannelForVideo = (videoId: string) => {
    const playerVideo = gameState.channel.videos.find((v) => v.id === videoId)
    if (playerVideo) return gameState.channel

    for (const channel of gameState.otherChannels) {
      if (channel.videos.find((v) => v.id === videoId)) {
        return channel
      }
    }
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to PUNSTA</h1>
        <p className="text-muted-foreground">The Ultimate Rap Simulator</p>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Puns</h2>
        {allVideos.length === 0 ? (
          <p className="text-muted-foreground">No Puns uploaded yet. Start creating!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allVideos.slice(0, 20).map((video) => {
              const channel = getChannelForVideo(video.id)
              return channel ? <VideoCard key={video.id} video={video} channel={channel} /> : null
            })}
          </div>
        )}
      </div>
    </div>
  )
}
