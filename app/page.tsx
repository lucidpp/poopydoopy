"use client"

import { useGame } from "@/components/game-provider"
import { VideoCard } from "@/components/video-card"
import { GameSetup } from "@/components/game-setup"
import type { Video as VideoType, BaseChannel } from "@/types/game"

export default function HomePage() {
  const { gameState } = useGame()

  if (!gameState.isGameStarted) {
    return <GameSetup />
  }

  const allVideos: { video: VideoType; channel: BaseChannel }[] = [
    ...gameState.channel.videos.map((video) => ({ video, channel: gameState.channel })),
    ...gameState.otherChannels.flatMap((otherChannel) =>
      otherChannel.videos.map((video) => ({ video, channel: otherChannel })),
    ),
  ]

  const displayVideos = allVideos
    .filter(({ video }) => !video.isProcessing)
    .sort((a, b) => new Date(b.video.uploadDate).getTime() - new Date(a.video.uploadDate).getTime())

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Home</h1>
      {displayVideos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Welcome to Punsta!</p>
          <p className="text-muted-foreground">Start by uploading your first Pun to see content here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayVideos.map(({ video, channel }) => (
            <VideoCard key={video.id} video={video} channel={channel} />
          ))}
        </div>
      )}
    </div>
  )
}
