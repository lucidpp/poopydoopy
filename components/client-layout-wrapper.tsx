"use client"

import type React from "react"
import { useGame } from "@/components/game-provider"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const { gameState } = useGame()
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  if (!gameState.isGameStarted) {
    return <>{children}</>
  }

  return (
    <div
      className="flex min-h-screen bg-background text-foreground"
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <Header />
      <Sidebar isHovered={isSidebarHovered} />
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto transition-all duration-300 ease-in-out pt-14 ${
          isSidebarHovered ? "ml-56" : "ml-[72px]"
        }`}
      >
        {children}
      </main>
    </div>
  )
}
