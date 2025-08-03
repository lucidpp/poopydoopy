// components/sidebar.tsx
"use client"

import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import Link from "next/link"
import {
  HomeIcon,
  CompassIcon,
  MusicIcon,
  LibraryIcon,
  HistoryIcon,
  ClockIcon,
  ThumbsUpIcon,
  FilmIcon,
  GamepadIcon,
  NewspaperIcon,
  LightbulbIcon,
  ShirtIcon,
  SettingsIcon,
  FlagIcon,
  HelpCircleIcon,
  MessageSquareIcon,
  MenuIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useGame } from "@/components/game-provider"
import { useSidebar } from "@/components/sidebar-context"
import { Button } from "./ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import type { BaseChannel } from "@/types/game"

interface SidebarProps {
  isHovered: boolean
}

export function Sidebar({ isHovered }: SidebarProps) {
  const { gameState } = useGame()
  const { setIsSidebarOpen } = useSidebar() // For mobile toggle
  const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(true)

  const sidebarClass = `fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] flex-col overflow-y-auto border-r bg-background p-4
    transition-all duration-300 ease-in-out
    ${isHovered ? "w-56" : "w-[72px]"} hidden lg:flex` // Hidden on small screens, fixed on large

  const showText = isHovered // Whether to show full text or just icons

  // Combine player's channel and other channels for subscriptions
  const allChannels: BaseChannel[] = [gameState.channel, ...gameState.otherChannels]

  return (
    <aside className={sidebarClass}>
      <nav className="grid gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden absolute top-2 right-2" // Mobile close button
          onClick={() => setIsSidebarOpen(false)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          {showText && "Home"}
          {!showText && <span className="sr-only">Home</span>}
        </Link>
        <Link
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <CompassIcon className="h-5 w-5" />
          {showText && "Explore"}
          {!showText && <span className="sr-only">Explore</span>}
        </Link>
        <Link
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <MusicIcon className="h-5 w-5" />
          {showText && "Subscriptions"}
          {!showText && <span className="sr-only">Subscriptions</span>}
        </Link>
      </nav>
      {showText && <Separator className="my-4" />}
      <nav className="grid gap-2">
        <Link
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <LibraryIcon className="h-5 w-5" />
          {showText && "Library"}
          {!showText && <span className="sr-only">Library</span>}
        </Link>
        <Link
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <HistoryIcon className="h-5 w-5" />
          {showText && "History"}
          {!showText && <span className="sr-only">History</span>}
        </Link>
        <Link
          href={`/channel/${gameState.channel.id}/videos`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <FilmIcon className="h-5 w-5" />
          {showText && "Your Puns"} {/* Renamed text */}
          {!showText && <span className="sr-only">Your Puns</span>} {/* Renamed text */}
        </Link>
        <Link
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <ClockIcon className="h-5 w-5" />
          {showText && "Watch later"}
          {!showText && <span className="sr-only">Watch later</span>}
        </Link>
        <Link
          href="#"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
            !showText && "justify-center"
          }`}
        >
          <ThumbsUpIcon className="h-5 w-5" />
          {showText && "Liked Puns"} {/* Renamed text */}
          {!showText && <span className="sr-only">Liked Puns</span>} {/* Renamed text */}
        </Link>
        {gameState.channel.playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/channel/${gameState.channel.id}/playlist/${playlist.id}`}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted ${
              !showText && "justify-center"
            }`}
          >
            <LibraryIcon className="h-5 w-5" />
            {showText && playlist.title}
            {!showText && <span className="sr-only">{playlist.title}</span>}
          </Link>
        ))}
      </nav>
      {showText && <Separator className="my-4" />}
      {/* Subscriptions Section */}
      {showText ? (
        <Collapsible open={isSubscriptionsOpen} onOpenChange={setIsSubscriptionsOpen} className="grid gap-2">
          <CollapsibleTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">Subscriptions</h3>
            {isSubscriptionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="grid gap-2">
            {allChannels.map((channel) => (
              <Link
                key={channel.id}
                href={`/channel/${channel.id}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                  <AvatarFallback>{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {channel.name}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <>
          <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">Subscriptions</h3>
          <nav className="grid gap-2">
            {allChannels.map((channel) => (
              <Link
                key={channel.id}
                href={`/channel/${channel.id}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted justify-center`}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={channel.avatar || "/placeholder.svg"} alt={channel.name} />
                  <AvatarFallback>{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="sr-only">{channel.name}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
      {showText && <Separator className="my-4" />}
      {showText && <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">More from Punsta</h3>}{" "}
      {/* Renamed text */}
      {showText && (
        <nav className="grid gap-2">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <MusicIcon className="h-5 w-5" />
            Punsta Music {/* Renamed text */}
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <FilmIcon className="h-5 w-5" />
            Punsta Kids {/* Renamed text */}
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <GamepadIcon className="h-5 w-5" />
            Punsta Gaming {/* Renamed text */}
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <NewspaperIcon className="h-5 w-5" />
            Punsta News {/* Renamed text */}
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <LightbulbIcon className="h-5 w-5" />
            Learning
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <ShirtIcon className="h-5 w-5" />
            Fashion & Beauty
          </Link>
        </nav>
      )}
      {showText && <Separator className="my-4" />}
      {showText && (
        <nav className="grid gap-2">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <FlagIcon className="h-5 w-5" />
            Report history
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <HelpCircleIcon className="h-5 w-5" />
            Help
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-muted"
          >
            <MessageSquareIcon className="h-5 w-5" />
            Send feedback
          </Link>
        </nav>
      )}
    </aside>
  )
}
