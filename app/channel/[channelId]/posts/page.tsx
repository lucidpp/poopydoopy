// app/channel/[channelId]/posts/page.tsx
"use client"

import Link from "next/link"
import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PostCreationModal } from "@/components/post-creation-modal"

export default function ChannelPostsPage({ params }: { params: { channelId: string } }) {
  const { gameState } = useGame()
  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)
  const [isPostCreationModalOpen, setIsPostCreationModalOpen] = useState(false)

  if (!channel) {
    notFound()
  }

  const isPlayerChannel = channel.id === gameState.channel.id

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} activeTab="posts" />
      <Tabs defaultValue="posts">
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
        <TabsContent value="posts" className="pt-4">
          {isPlayerChannel && (
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsPostCreationModalOpen(true)}>Create Post</Button>
            </div>
          )}
          <div className="grid gap-4">
            {channel.posts.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-10">
                No posts yet. {isPlayerChannel ? "Create your first update!" : ""}
              </p>
            ) : (
              channel.posts.map((post) => <PostCard key={post.id} post={post} channel={channel} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
      <PostCreationModal isOpen={isPostCreationModalOpen} onClose={() => setIsPostCreationModalOpen(false)} />
    </div>
  )
}
