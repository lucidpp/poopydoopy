// components/sidebar-context.tsx
"use client"

import type React from "react"
import { createContext, useState, useContext, useMemo } from "react"
import type { SidebarContextType } from "@/types/game"

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const value = useMemo(() => ({ isSidebarOpen, setIsSidebarOpen }), [isSidebarOpen])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
