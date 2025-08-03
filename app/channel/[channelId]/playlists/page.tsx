"use client"

import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { PlaylistCard } from "@/components/playlist-card"
import { notFound } from "next/navigation"

export default function ChannelPlaylistsPage({ params }: { params: { channelId: string } }) {
  const { gameState } = useGame()

  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)

  if (!channel) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} activeTab="playlists" />

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        {channel.playlists.length === 0 ? (
          <p className="text-muted-foreground">No playlists created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channel.playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
