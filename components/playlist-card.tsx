// components/playlist-card.tsx
import Link from "next/link"
import type { Playlist, BaseChannel } from "@/types/game" // Changed to BaseChannel
import { ListVideoIcon } from "lucide-react"

interface PlaylistCardProps {
  playlist: Playlist
  channel: BaseChannel // Changed to BaseChannel
}

export function PlaylistCard({ playlist, channel }: PlaylistCardProps) {
  return (
    <Link href={`/channel/${channel.id}/playlist/${playlist.id}`} className="block group">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <img
          src={playlist.thumbnail || "/placeholder.svg"}
          alt={playlist.title}
          width={320}
          height={180}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ListVideoIcon className="h-10 w-10 text-white" />
        </div>
        <div className="absolute bottom-0 right-0 bg-black/70 text-white p-2 flex items-center gap-1 rounded-tl-lg">
          <ListVideoIcon className="h-4 w-4" />
          <span>{playlist.videoIds.length}</span>
        </div>
      </div>
      <div className="pt-2">
        <h3 className="text-base font-semibold line-clamp-2">{playlist.title}</h3>
        <p className="text-sm text-muted-foreground">{channel.name}</p>
      </div>
    </Link>
  )
}
