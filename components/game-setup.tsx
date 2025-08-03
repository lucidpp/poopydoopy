"use client"

import { useState } from "react"
import { useGame } from "@/components/game-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function GameSetup() {
  const { startGame } = useGame()
  const [channelName, setChannelName] = useState("")
  const [subscriberCount, setSubscriberCount] = useState([1000])

  const handleStartGame = () => {
    if (channelName.trim()) {
      startGame(channelName.trim(), subscriberCount[0])
    }
  }

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`
    }
    return count.toString()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">PUNSTA</CardTitle>
          <CardDescription>The Ultimate Rap Simulator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="channelName">Your Punster Name</Label>
            <Input
              id="channelName"
              placeholder="Enter your channel name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleStartGame()}
            />
          </div>

          <div className="space-y-4">
            <Label>Starting Subscriber Count: {formatSubscribers(subscriberCount[0])}</Label>
            <Slider
              value={subscriberCount}
              onValueChange={setSubscriberCount}
              max={10000000}
              min={100}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>10M</span>
            </div>
          </div>

          <Button onClick={handleStartGame} className="w-full" disabled={!channelName.trim()}>
            Start Your Rap Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
