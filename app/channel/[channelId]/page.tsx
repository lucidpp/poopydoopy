"use client"

import { useGame } from "@/components/game-provider"
import { ChannelHeader } from "@/components/channel-header"
import { VideoCard } from "@/components/video-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import type { Video as VideoType, PlayerChannel } from "@/types/game"

export default function ChannelHomePage({ params }: { params: { channelId: string } }) {
  const { gameState } = useGame()

  const channel =
    gameState.channel.id === params.channelId
      ? gameState.channel
      : gameState.otherChannels.find((c) => c.id === params.channelId)

  if (!channel) {
    notFound()
  }

  const latestVideos = [...channel.videos]
    .filter((v) => !v.isProcessing)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 10)

  const popularVideos = [...channel.videos]
    .filter((v) => !v.isProcessing)
    .sort((a, b) => b.currentViews - a.currentViews)
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-6">
      <ChannelHeader channel={channel} activeTab="home" />
      <Tabs defaultValue="home">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="home" asChild>
            <Link href={`/channel/${channel.id}`}>HOME</Link>
          </TabsTrigger>
          <TabsTrigger value="videos" asChild>
            <Link href={`/channel/${channel.id}/videos`}>PUNS</Link>
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
        <TabsContent value="home" className="pt-4">
          {channel.homepageLayout && channel.id === gameState.channel.id ? (
            (channel as PlayerChannel).homepageLayout.map((sectionId) => {
              switch (sectionId) {
                case "latestVideos":
                  return (
                    <div key="latestVideos" className="mb-8">
                      <h2 className="text-xl font-bold mb-4">Latest Uploads</h2>
                      {latestVideos.length === 0 ? (
                        <p className="text-muted-foreground">No Puns uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {latestVideos.map((video) => (
                            <VideoCard key={video.id} video={video} channel={channel} />
                          ))}
                        </div>
                      )}
                      <Separator className="my-8" />
                    </div>
                  )
                case "popularVideos":
                  return (
                    <div key="popularVideos" className="mb-8">
                      <h2 className="text-xl font-bold mb-4">Popular Uploads</h2>
                      {popularVideos.length === 0 ? (
                        <p className="text-muted-foreground">No popular Puns yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {popularVideos.map((video) => (
                            <VideoCard key={video.id} video={video} channel={channel} />
                          ))}
                        </div>
                      )}
                      <Separator className="my-8" />
                    </div>
                  )
                case "playlists":
                  return (
                    <div key="playlists" className="mb-8">
                      <h2 className="text-xl font-bold mb-4">Playlists</h2>
                      {channel.playlists.length === 0 ? (
                        <p className="text-muted-foreground">No playlists created yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {channel.playlists.map((playlist) => (
                            <VideoCard
                              key={playlist.id}
                              video={{
                                id: playlist.id,
                                title: playlist.title,
                                description: playlist.description,
                                thumbnail: playlist.thumbnail,
                                uploadDate: "",
                                initialViews: 0,
                                currentViews: playlist.videoIds.length,
                                initialLikes: 0,
                                currentLikes: 0,
                                initialDislikes: 0,
                                currentDislikes: 0,
                                totalComments: [],
                                displayedComments: [],
                                analytics: {
                                  countryStats: {},
                                  cityStats: {},
                                  engagement: {
                                    averageViewDuration: 0,
                                    clickThroughRate: 0,
                                    likesToViewsRatio: 0,
                                    dislikesToViewsRatio: 0,
                                  },
                                },
                                type: "video",
                                quality: 3,
                              }}
                              channel={channel}
                            />
                          ))}
                        </div>
                      )}
                      <Separator className="my-8" />
                    </div>
                  )
                default:
                  return null
              }
            })
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">All Uploads</h2>
              {channel.videos.length === 0 ? (
                <p className="text-muted-foreground">No Puns uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {channel.videos.map((video: VideoType) => (
                    <VideoCard key={video.id} video={video} channel={channel} />
                  ))}
                </div>
              )}
              <Separator className="my-8" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
