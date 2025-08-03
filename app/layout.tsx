import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GameProvider } from "@/components/game-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/sidebar-context"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PUNSTA: The Ultimate Rap Simulator",
  description: "Simulate being a rapper on Punsta!",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <GameProvider>
            <SidebarProvider>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
              <Toaster />
            </SidebarProvider>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
