"use client"

import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { PostCard } from "@/components/post-card"
import { notFound } from "next/navigation"

export default function ChannelPostsPage({ params }: { params: { channelId: string } }) {
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
      <ChannelHeader channel={channel} activeTab="posts" />

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {channel.posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {channel.posts.map((post) => (
              <PostCard key={post.id} post={post} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
