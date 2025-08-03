"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGame } from "@/components/game-provider"

export function GameSetup() {
  const [channelName, setChannelName] = useState("")
  const { startGame } = useGame()

  const handleStartGame = () => {
    if (channelName.trim()) {
      startGame(channelName.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to PUNSTA</CardTitle>
          <CardDescription>The Ultimate Rap Simulator - Start your journey to becoming a rap legend!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="channelName" className="text-sm font-medium">
              Your Rapper Name
            </label>
            <Input
              id="channelName"
              placeholder="Enter your rapper name..."
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleStartGame()}
            />
          </div>
          <Button onClick={handleStartGame} className="w-full" disabled={!channelName.trim()}>
            Start Your Rap Career
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
