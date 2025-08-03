// components/ad-campaign-modal.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGame } from "@/components/game-provider"
import { useToast } from "@/components/ui/use-toast"

interface AdCampaignModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdCampaignModal({ isOpen, onClose }: AdCampaignModalProps) {
  const { gameState, runAdCampaign } = useGame()
  const [budget, setBudget] = useState("")
  const { toast } = useToast()

  const handleRunCampaign = () => {
    const budgetAmount = Number.parseInt(budget)
    if (isNaN(budgetAmount) || budgetAmount <= 0 || budgetAmount > gameState.channel.money) {
      toast({
        title: "Invalid Budget",
        description: `Please enter a positive number up to $${gameState.channel.money.toLocaleString()}.`,
        variant: "destructive",
      })
      return
    }

    runAdCampaign(budgetAmount)
    toast({
      title: "Ad Campaign Successful!",
      description: `You spent $${budgetAmount.toLocaleString()} and gained ${Math.floor(budgetAmount / 100).toLocaleString()} new subscribers.`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen && !gameState.channel.hasAdvertised} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run Your First Ad Campaign</DialogTitle>
          <DialogDescription>
            This is your one-time opportunity to boost your channel! You have a budget of{" "}
            <span className="font-bold text-green-400">${gameState.channel.money.toLocaleString()}</span>. Spend wisely
            to gain initial subscribers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="budget" className="text-right">
              Budget ($)
            </label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="col-span-3"
              placeholder={`Max: ${gameState.channel.money.toLocaleString()}`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleRunCampaign} disabled={gameState.channel.hasAdvertised}>
            Run Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
