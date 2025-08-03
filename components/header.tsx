"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchIcon, BellIcon, VideoIcon, MenuIcon } from "lucide-react"
import { useGame } from "@/components/game-provider"
import { useSidebar } from "@/components/sidebar-context"
import Link from "next/link"

export function Header() {
  const { gameState } = useGame()
  const { setIsSidebarOpen } = useSidebar()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
          <MenuIcon className="h-6 w-6" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">Punsta</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4">
        <div className="flex">
          <Input type="search" placeholder="Search" className="rounded-r-none border-r-0" />
          <Button variant="outline" className="rounded-l-none px-6 bg-transparent">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/studio">
          <Button variant="ghost" size="icon">
            <VideoIcon className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={gameState.channel.avatar || "/placeholder.svg"} alt={gameState.channel.name} />
                <AvatarFallback>{gameState.channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem asChild>
              <Link href={`/channel/${gameState.channel.id}`}>Your channel</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/studio">Punsta Studio</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
