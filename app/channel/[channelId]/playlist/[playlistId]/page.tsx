// app/channel/[channelId]/playlist/[playlistId]/page.tsx
"use client"

import Link from "next/link"

import { useGame } from "@/components/game-provider"
import { VideoCard } from "@/components/video-card"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ListVideoIcon } from "lucide-react"
import type { Video } from "@/types/game" // Import Video and BaseChannel type
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function PlaylistPage({ params }: { params: { channelId: string; playlistId: string } }) {
  const { gameState } = useGame()

  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)

  if (!channel) {
    notFound()
  }

  const playlist = channel.playlists.find((pl) => pl.id === params.playlistId)

  if (!playlist) {
    notFound()
  }

  const videosInPlaylist = playlist.videoIds
    .map((videoId) => channel.videos.find((v) => v.id === videoId))
    .filter((v) => v !== undefined) as Video[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 bg-card p-6 rounded-lg shadow-md">
        <div className="relative aspect-video w-full md:w-1/3 overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={playlist.thumbnail || "/placeholder.svg"}
            alt={playlist.title}
            width={320}
            height={180}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-black/70 text-white p-2 flex items-center gap-1 rounded-tl-lg">
            <ListVideoIcon className="h-4 w-4" />
            <span>{videosInPlaylist.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-muted-foreground">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/channel/${channel.id}`}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                <AvatarFallback>{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <Link href={`/channel/${channel.id}`} className="hover:underline">
              {channel.name}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">{videosInPlaylist.length} Puns</p> {/* Renamed text */}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videosInPlaylist.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-10">This playlist is empty.</p>
        ) : (
          videosInPlaylist.map((video) => <VideoCard key={video.id} video={video} channel={channel} />)
        )}
      </div>
    </div>
  )
}
