// components/video-card.tsx
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Video, BaseChannel } from "@/types/game" // Changed to BaseChannel
import Image from "next/image"

interface VideoCardProps {
  video: Video
  channel: BaseChannel // Changed to BaseChannel
}

export function VideoCard({ video, channel }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`
    }
    return views.toString()
  }

  return (
    <Link href={`/video/${video.id}`} className="block group">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <img
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          width={320}
          height={180}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {video.isProcessing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-lg font-semibold">
            Processing...
          </div>
        )}
      </div>
      <div className="flex items-start gap-3 pt-2">
        <Link href={`/channel/${channel.id}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
            <AvatarFallback>{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="grid gap-1">
          <h3 className="text-base font-semibold line-clamp-2">{video.title}</h3>
          <Link
            href={`/channel/${channel.id}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <p>{channel.name}</p>
            {channel.isVerified && (
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YT_Official_Verified_Checkmark_Circle.svg-t9EM6UBaNAg2rqjLcalWIvpdcydKrL.png"
                alt="Verified Badge"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            )}
          </Link>
          <p className="text-sm text-muted-foreground">
            {formatViews(video.currentViews)} views • {video.uploadDate}
          </p>
        </div>
      </div>
    </Link>
  )
}
