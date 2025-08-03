// app/video/[videoId]/page.tsx
"use client"

import { useGame } from "@/components/game-provider"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, ThumbsDown, Share2, Save, MessageSquare, MusicIcon, FileTextIcon } from "lucide-react" // Added FileTextIcon
import Link from "next/link"
import { VideoCard } from "@/components/video-card"
import type { BaseChannel, Video as VideoType } from "@/types/game"

export default function VideoWatchPage({ params }: { params: { videoId: string } }) {
  const { gameState } = useGame()

  let video: VideoType | undefined
  let channel: BaseChannel | undefined

  // Try to find the video in the player's channel
  video = gameState.channel.videos.find((v) => v.id === params.videoId)
  if (video) {
    channel = gameState.channel
  } else {
    // If not found, search in other channels
    for (const otherChannel of gameState.otherChannels) {
      video = otherChannel.videos.find((v) => v.id === params.videoId)
      if (video) {
        channel = otherChannel
        break
      }
    }
  }

  if (!video || !channel) {
    notFound()
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`
    }
    return views.toString()
  }

  const formatSubscribers = (subscribers: number) => {
    if (subscribers >= 1000000) {
      return `${(subscribers / 1000000).toFixed(1)}M`
    }
    if (subscribers >= 1000) {
      return `${(subscribers / 1000).toFixed(0)}K`
    }
    return subscribers.toString()
  }

  // Filter and sort recommended videos (from both player and other channels)
  const allAvailableVideos = [
    ...gameState.channel.videos,
    ...gameState.otherChannels.flatMap((oc) => oc.videos),
  ].filter((v) => v.id !== video!.id && !v.isProcessing) // Exclude current video and processing ones

  const recommendedVideos = allAvailableVideos.sort(() => 0.5 - Math.random()).slice(0, 10) // Get up to 10 random recommended videos

  // Filter and sort related releases if current video is a release (from both player and other channels)
  const relatedReleases =
    video.type === "release"
      ? allAvailableVideos
          .filter((v) => v.type === "release")
          .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()) // Sort by latest
      : []

  // Function to get the channel for a recommended video
  const getChannelForVideo = (vid: VideoType): BaseChannel => {
    if (gameState.channel.videos.includes(vid)) return gameState.channel
    return gameState.otherChannels.find((oc) => oc.videos.includes(vid)) || gameState.channel // Fallback
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center text-white text-xl">
          {video.isProcessing ? (
            <p>Pun Processing...</p> // Renamed text
          ) : video.videoFileName ? (
            <div className="flex flex-col items-center gap-2">
              <FileTextIcon className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-semibold text-center">{video.videoFileName}</p>
              <p className="text-sm text-gray-400">({(video.videoFileSize! / (1024 * 1024)).toFixed(2)} MB)</p>
              <p className="text-xs text-orange-400 mt-2">
                (Actual video playback is simulated. File metadata is saved locally.)
              </p>
            </div>
          ) : (
            <p>Pun Player Placeholder</p> // Renamed text
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">{video.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/channel/${channel.id}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                <AvatarFallback>{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="grid gap-0.5">
              <Link href={`/channel/${channel.id}`} className="font-semibold hover:underline">
                {channel.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                {formatSubscribers(channel.subscribers)} subscribers
              </span>
            </div>
            {channel.id !== gameState.channel.id && (
              <Button variant="secondary" className="ml-4">
                Subscribe
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="flex items-center gap-1">
              <ThumbsUp className="h-5 w-5" /> {formatViews(video.currentLikes)}
            </Button>
            <Button variant="ghost" className="flex items-center gap-1">
              <ThumbsDown className="h-5 w-5" /> {formatViews(video.currentDislikes)}
            </Button>
            <Button variant="ghost" className="flex items-center gap-1">
              <Share2 className="h-5 w-5" /> Share
            </Button>
            <Button variant="ghost" className="flex items-center gap-1">
              <Save className="h-5 w-5" /> Save
            </Button>
          </div>
        </div>
        <div className="bg-muted p-3 rounded-lg text-sm">
          <p className="font-semibold">
            {formatViews(video.currentViews)} views • {video.uploadDate}
          </p>
          <p className="mt-2">{video.description}</p>
        </div>

        <Separator />

        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare /> Comments ({video.displayedComments.length})
        </h2>
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          {video.displayedComments.length === 0 && <p className="text-muted-foreground">No comments yet...</p>}
          {video.displayedComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3 mb-4">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${comment.user}`} alt={comment.user} />
                <AvatarFallback>{comment.user.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-sm">{comment.user}</div>
                  <div className="text-xs text-muted-foreground">{comment.timeAgo}</div>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-4">
        {relatedReleases.length > 0 && (
          <>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MusicIcon className="h-5 w-5" /> Up Next: Releases
            </h2>
            {relatedReleases.map((recVideo) => (
              <VideoCard key={recVideo.id} video={recVideo} channel={getChannelForVideo(recVideo)} />
            ))}
            <Separator />
          </>
        )}
        <h2 className="text-lg font-semibold">Recommended</h2>
        {recommendedVideos.length === 0 && relatedReleases.length === 0 ? (
          <p className="text-muted-foreground">No other Puns to recommend yet.</p> // Renamed text
        ) : (
          recommendedVideos.map((recVideo) => (
            <VideoCard key={recVideo.id} video={recVideo} channel={getChannelForVideo(recVideo)} />
          ))
        )}
      </div>
    </div>
  )
}
