// app/channel/[channelId]/playlists/page.tsx
"use client"

import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { PlaylistCard } from "@/components/playlist-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import Link from "next/link"

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
      <Tabs defaultValue="playlists">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="home" asChild>
            <Link href={`/channel/${channel.id}`}>HOME</Link>
          </TabsTrigger>
          <TabsTrigger value="videos" asChild>
            <Link href={`/channel/${channel.id}/videos`}>PUNS</Link> {/* Renamed text */}
          </TabsTrigger>
          <TabsTrigger value="playlists" asChild>
            <Link href={`/channel/${channel.id}/playlists`}>PLAYLISTS</Link>
          </TabsTrigger>
          <TabsTrigger value="posts" asChild>
            <Link href={`/channel/${channel.id}/posts`}>POSTS</Link>
          </TabsTrigger>
          <TabsTrigger value="releases" asChild>
            <Link href={`/channel/${channel.id}/releases`}>RELEASES</Link>
          </TabsTrigger>
          <TabsTrigger value="about" asChild>
            <Link href={`/channel/${channel.id}/about`}>ABOUT</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {channel.playlists.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-10">No playlists created yet.</p>
            ) : (
              channel.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} channel={channel} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
