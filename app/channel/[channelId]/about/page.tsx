"use client"

import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { Calendar, Users, Eye, ThumbsUp } from "lucide-react"

export default function ChannelAboutPage({ params }: { params: { channelId: string } }) {
  const { gameState } = useGame()

  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)

  if (!channel) {
    notFound()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  const totalViews = channel.videos.reduce((sum, video) => sum + video.currentViews, 0)
  const totalLikes = channel.videos.reduce((sum, video) => sum + video.currentLikes, 0)

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} activeTab="about" />

      <div className="px-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About {channel.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{channel.bio || "This Punster hasn't added a bio yet."}</p>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                  <p className="font-semibold">{formatNumber(channel.subscribers)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="font-semibold">{formatNumber(totalViews)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                  <p className="font-semibold">{formatNumber(totalLikes)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Puns</p>
                  <p className="font-semibold">{channel.videos.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
