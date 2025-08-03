// app/channel/[channelId]/releases/page.tsx
"use client"

import Link from "next/link"
import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { VideoCard } from "@/components/video-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"

export default function ChannelReleasesPage({ params }: { params: { channelId: string } }) {
  const { gameState } = useGame()
  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)

  if (!channel) {
    notFound()
  }

  const releases = channel.videos.filter((video) => video.type === "release" && !video.isProcessing)

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} activeTab="releases" />
      <Tabs defaultValue="releases">
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
        <TabsContent value="releases" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {releases.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-10">No releases uploaded yet.</p>
            ) : (
              releases.map((video) => <VideoCard key={video.id} video={video} channel={channel} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
