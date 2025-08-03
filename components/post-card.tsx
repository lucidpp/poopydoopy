// components/post-card.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Post, BaseChannel } from "@/types/game" // Changed to BaseChannel
import { ThumbsUp, MessageSquare } from "lucide-react"
import Link from "next/link"

interface PostCardProps {
  post: Post
  channel: BaseChannel // Changed to BaseChannel
}

export function PostCard({ post, channel }: PostCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  const timeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`
    return `${Math.floor(seconds / 31536000)} years ago`
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
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
          <div className="text-sm text-muted-foreground">{timeAgo(post.timestamp)}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-base mb-4">{post.content}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{formatNumber(post.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{formatNumber(post.comments)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
