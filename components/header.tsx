"use client"

import { useState } from "react"
import { useGame } from "@/components/game-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VideoUploadModal } from "@/components/video-upload-modal"
import { useSidebar } from "@/components/sidebar-context"
import Link from "next/link"
import { Menu, Search, Upload, User, DollarSign } from "lucide-react"

export function Header() {
  const { gameState } = useGame()
  const { setIsSidebarOpen } = useSidebar()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  if (!gameState.isGameStarted) {
    return null
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="mr-6 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl">PUNSTA</div>
          </Link>
        </div>

        <div className="flex flex-1 items-center space-x-2 justify-end">
          <form className="hidden sm:flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search Puns..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {formatMoney(gameState.channel.money)}
              </span>
            </div>

            <Button onClick={() => setIsUploadModalOpen(true)} size="sm" className="hidden sm:flex">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>

            <Link href={`/channel/${gameState.channel.id}`}>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={gameState.channel.avatar || "/placeholder.svg"} alt={gameState.channel.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <VideoUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </header>
  )
}
