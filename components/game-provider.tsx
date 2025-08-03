// components/game-provider.tsx
"use client"

import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from "react"
import type { GameState, GameContextType, Video, Playlist, Post } from "@/types/game"
import {
  generateRandomComments,
  generateRandomAnalytics,
  initialChannelDataTemplate,
  MILESTONES,
  PUN_EDITING_SKILL_COSTS,
  initialOtherChannels,
} from "@/lib/game-data"
import { useToast } from "@/components/ui/use-toast"

const GameContext = createContext<GameContextType | undefined>(undefined)

// Multipliers for content quality and type
const QUALITY_MULTIPLIERS = {
  1: 0.1, // Poor
  2: 0.4, // Standard
  3: 1.0, // Good (baseline)
  4: 2.0, // Great
  5: 5.0, // Masterpiece
}

const TYPE_MULTIPLIERS = {
  video: 1.0,
  release: 0.5, // Releases perform 50% as well as videos of the same quality
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize state from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("punstaSimState") // Renamed localStorage key
      if (savedState) {
        try {
          const parsedState: GameState = JSON.parse(savedState)
          // Re-initialize transient properties for player's videos
          parsedState.channel.videos = parsedState.channel.videos.map((video) => ({
            ...video,
            isProcessing: false, // Reset processing state on load
            displayedComments: [], // Comments will re-populate via simulation
            viewIntervalId: null, // Clear interval IDs as they are not serializable
            commentIntervalId: null, // Clear interval IDs
          }))
          // Ensure new properties are initialized for old saves
          if (!parsedState.channel.posts) parsedState.channel.posts = []
          if (!parsedState.channel.homepageLayout)
            parsedState.channel.homepageLayout = ["latestVideos", "popularVideos", "playlists"]
          if (!parsedState.channel.milestones) parsedState.channel.milestones = []
          if (!parsedState.channel.analyticsHistory) parsedState.channel.analyticsHistory = []
          if (parsedState.isGameStarted === undefined) parsedState.isGameStarted = true // Assume started if old save
          if (!parsedState.channel.punEditingSkill) parsedState.channel.punEditingSkill = 1 // Initialize new skill
          // Initialize other channels if not present in saved state
          if (!parsedState.otherChannels) parsedState.otherChannels = initialOtherChannels
          else {
            // Merge loaded otherChannels with initial ones to add new default channels
            const mergedOtherChannelsMap = new Map(initialOtherChannels.map((channel) => [channel.id, channel]))
            parsedState.otherChannels.forEach((loadedChannel) => {
              mergedOtherChannelsMap.set(loadedChannel.id, loadedChannel)
            })
            parsedState.otherChannels = Array.from(mergedOtherChannelsMap.values()).map((channel) => ({
              ...channel,
              videos: channel.videos.map((video) => ({
                ...video,
                isProcessing: false,
                displayedComments: [],
                viewIntervalId: null,
                commentIntervalId: null,
              })),
            }))
          }

          console.log("Loaded game state from localStorage:", parsedState)
          toast({
            title: "Game Loaded!",
            description: "Your progress has been restored.",
          })
          return parsedState
        } catch (error) {
          console.error("Failed to parse saved game state from localStorage:", error)
          toast({
            title: "Load Error",
            description: "Failed to load saved game. Starting new game.",
            variant: "destructive",
          })
          return { channel: initialChannelDataTemplate, otherChannels: initialOtherChannels, isGameStarted: false }
        }
      }
    }
    console.log("Starting new game setup.")
    return { channel: initialChannelDataTemplate, otherChannels: initialOtherChannels, isGameStarted: false }
  })

  const videoIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const commentIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const dailyUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const updateVideoStats = useCallback((videoId: string, updates: Partial<Video>) => {
    setGameState((prev) => {
      const updatedPlayerVideos = prev.channel.videos.map((video) =>
        video.id === videoId ? { ...video, ...updates } : video,
      )
      const updatedOtherChannels = prev.otherChannels.map((otherChannel) => ({
        ...otherChannel,
        videos: otherChannel.videos.map((video) => (video.id === videoId ? { ...video, ...updates } : video)),
      }))

      return {
        ...prev,
        channel: {
          ...prev.channel,
          videos: updatedPlayerVideos,
        },
        otherChannels: updatedOtherChannels,
      }
    })
  }, [])

  const startVideoSimulation = useCallback(
    (video: Video, channelType: "player" | "other" = "player") => {
      // Clear existing intervals for this video if any
      if (videoIntervalsRef.current.has(video.id)) {
        clearInterval(videoIntervalsRef.current.get(video.id)!)
      }
      if (commentIntervalsRef.current.has(video.id)) {
        clearInterval(commentIntervalsRef.current.get(video.id)!)
      }

      const qualityMultiplier = QUALITY_MULTIPLIERS[video.quality] || 1.0
      const typeMultiplier = TYPE_MULTIPLIERS[video.type] || 1.0
      const overallMultiplier = qualityMultiplier * typeMultiplier

      // Target views based on initial views and overall multiplier
      const targetViews = video.initialViews * (Math.random() * 5 + 5) * overallMultiplier // Target 5x to 10x initial views
      let viewsToAdd = targetViews - video.currentViews
      if (viewsToAdd < 0) viewsToAdd = 0

      const targetLikes = video.initialLikes * (Math.random() * 3 + 2) * overallMultiplier
      let likesToAdd = targetLikes - video.currentLikes
      if (likesToAdd < 0) likesToAdd = 0

      const targetDislikes = video.initialDislikes * (Math.random() * 2 + 1) * overallMultiplier
      let dislikesToAdd = targetDislikes - video.currentDislikes
      if (dislikesToAdd < 0) dislikesToAdd = 0

      let commentIndex = video.displayedComments.length // Start from already displayed comments

      const viewInterval = setInterval(() => {
        setGameState((prev) => {
          const updateChannelVideos = (channels: any[]) =>
            channels.map((channelItem) => {
              if (channelItem.videos.some((v: Video) => v.id === video.id)) {
                return {
                  ...channelItem,
                  videos: channelItem.videos.map((v: Video) => {
                    if (v.id === video.id) {
                      let currentViews = v.currentViews
                      let currentLikes = v.currentLikes
                      let currentDislikes = v.currentDislikes

                      if (viewsToAdd > 0) {
                        const remainingRatio = viewsToAdd / (targetViews || 1)
                        const add = Math.min(
                          Math.ceil(remainingRatio * 1000 + 10),
                          Math.max(1, Math.floor(viewsToAdd * 0.05)),
                          500,
                        )
                        currentViews += add
                        viewsToAdd -= add
                      } else {
                        currentViews += Math.floor(Math.random() * 5) // Small trickle views after main growth
                      }

                      // Likes and dislikes grow based on current views and engagement ratios
                      const expectedLikes = currentViews * (v.analytics.engagement.likesToViewsRatio / 100)
                      const expectedDislikes = currentViews * (v.analytics.engagement.dislikesToViewsRatio / 100)

                      // Adjust current likes/dislikes towards expected, with some randomness
                      currentLikes += Math.floor((expectedLikes - currentLikes) * (Math.random() * 0.05 + 0.01)) // 1-5% adjustment
                      currentDislikes += Math.floor(
                        (expectedDislikes - currentDislikes) * (Math.random() * 0.05 + 0.01),
                      ) // 1-5% adjustment

                      // Ensure they don't go below initial values
                      currentLikes = Math.max(v.initialLikes, currentLikes)
                      currentDislikes = Math.max(v.initialDislikes, currentDislikes)

                      const updatedAnalytics = generateRandomAnalytics(currentViews)

                      return {
                        ...v,
                        currentViews,
                        currentLikes,
                        currentDislikes,
                        analytics: updatedAnalytics,
                      }
                    }
                    return v
                  }),
                }
              }
              return channelItem
            })

          let updatedPlayerChannel = prev.channel
          let updatedOtherChannels = prev.otherChannels

          if (channelType === "player") {
            updatedPlayerChannel = updateChannelVideos([prev.channel])[0]
          } else {
            updatedOtherChannels = updateChannelVideos(prev.otherChannels)
          }

          const newTotalViews =
            updatedPlayerChannel.videos.reduce((sum, v) => sum + v.currentViews, 0) +
            updatedOtherChannels.reduce((acc, curr) => acc + curr.videos.reduce((s, v) => s + v.currentViews, 0), 0)

          return {
            ...prev,
            channel: updatedPlayerChannel,
            otherChannels: updatedOtherChannels,
            totalViews: newTotalViews, // Update overall total views
          }
        })
      }, 1000)

      const commentInterval = setInterval(
        () => {
          setGameState((prev) => {
            const updateChannelComments = (channels: any[]) =>
              channels.map((channelItem) => {
                if (channelItem.videos.some((v: Video) => v.id === video.id)) {
                  return {
                    ...channelItem,
                    videos: channelItem.videos.map((v: Video) => {
                      if (v.id === video.id && commentIndex < v.totalComments.length) {
                        const newDisplayedComments = [...v.displayedComments, v.totalComments[commentIndex]]
                        commentIndex++
                        return {
                          ...v,
                          displayedComments: newDisplayedComments,
                        }
                      }
                      return v
                    }),
                  }
                }
                return channelItem
              })

            let updatedPlayerChannel = prev.channel
            let updatedOtherChannels = prev.otherChannels

            if (channelType === "player") {
              updatedPlayerChannel = updateChannelComments([prev.channel])[0]
            } else {
              updatedOtherChannels = updateChannelComments(prev.otherChannels)
            }

            return {
              ...prev,
              channel: updatedPlayerChannel,
              otherChannels: updatedOtherChannels,
            }
          })
        },
        Math.random() * 3000 + 1000,
      )

      videoIntervalsRef.current.set(video.id, viewInterval)
      commentIntervalsRef.current.set(video.id, commentInterval)
    },
    [setGameState],
  )

  // Daily analytics and milestone check
  const runDailyUpdate = useCallback(() => {
    setGameState((prev) => {
      const today = new Date().toISOString().split("T")[0]
      const lastEntry = prev.channel.analyticsHistory[prev.channel.analyticsHistory.length - 1]

      // Only add new entry if it's a new day or no entries exist
      if (!lastEntry || lastEntry.date !== today) {
        const currentViews = prev.channel.totalViews
        const currentSubscribers = prev.channel.subscribers
        const currentLikes = prev.channel.videos.reduce((sum, v) => sum + v.currentLikes, 0)

        const newAnalyticsEntry = {
          date: today,
          views: currentViews,
          subscribers: currentSubscribers,
          likes: currentLikes,
        }

        // Check for milestones
        const newMilestones = [...prev.channel.milestones]
        MILESTONES.forEach((milestone) => {
          if (!newMilestones.includes(milestone.id)) {
            if (milestone.type === "subscribers" && currentSubscribers >= milestone.threshold) {
              newMilestones.push(milestone.id)
              toast({
                title: "Milestone Achieved!",
                description: milestone.message,
                duration: 5000,
              })
            } else if (milestone.type === "views" && currentViews >= milestone.threshold) {
              newMilestones.push(milestone.id)
              toast({
                title: "Milestone Achieved!",
                description: milestone.message,
                duration: 5000,
              })
            }
          }
        })

        // Randomly increase subscriber count for other channels
        const updatedOtherChannels = prev.otherChannels.map((otherChannel) => {
          if (otherChannel.id === "coryxkenshin") {
            // CoryXKenshin's subscribers are fixed as per request
            return otherChannel
          }
          const subGrowth = Math.floor(Math.random() * 1000) // Example growth
          return {
            ...otherChannel,
            subscribers: otherChannel.subscribers + subGrowth,
            totalViews: otherChannel.totalViews + Math.floor(Math.random() * 50000), // Example view growth
          }
        })

        return {
          ...prev,
          channel: {
            ...prev.channel,
            analyticsHistory: [...prev.channel.analyticsHistory, newAnalyticsEntry],
            milestones: newMilestones,
          },
          otherChannels: updatedOtherChannels,
        }
      }
      return prev
    })
  }, [toast])

  useEffect(() => {
    if (gameState.isGameStarted) {
      // Start daily update interval
      if (dailyUpdateIntervalRef.current) clearInterval(dailyUpdateIntervalRef.current)
      dailyUpdateIntervalRef.current = setInterval(runDailyUpdate, 60 * 1000) // Every minute for simulation purposes

      // Run initial daily update on load
      runDailyUpdate()

      // Start simulations for existing videos of player channel
      gameState.channel.videos.forEach((video) => {
        if (!video.isProcessing && (!video.viewIntervalId || !videoIntervalsRef.current.has(video.id))) {
          startVideoSimulation(video, "player")
        }
      })

      // Start simulations for existing videos of other channels
      gameState.otherChannels.forEach((otherChannel) => {
        otherChannel.videos.forEach((video) => {
          if (!video.isProcessing && (!video.viewIntervalId || !videoIntervalsRef.current.has(video.id))) {
            startVideoSimulation(video, "other")
          }
        })
      })
    }

    return () => {
      videoIntervalsRef.current.forEach((intervalId) => clearInterval(intervalId))
      commentIntervalsRef.current.forEach((intervalId) => clearInterval(intervalId))
      if (dailyUpdateIntervalRef.current) clearInterval(dailyUpdateIntervalRef.current)
    }
  }, [gameState.channel.videos, gameState.otherChannels, gameState.isGameStarted, runDailyUpdate, startVideoSimulation])

  useEffect(() => {
    try {
      const stateToSave = {
        ...gameState,
        channel: {
          ...gameState.channel,
          videos: gameState.channel.videos.map((video) => {
            const { viewIntervalId, commentIntervalId, isProcessing, displayedComments, ...rest } = video
            return { ...rest, isProcessing: false, displayedComments: [] }
          }),
        },
        otherChannels: gameState.otherChannels.map((otherChannel) => ({
          ...otherChannel,
          videos: otherChannel.videos.map((video) => {
            const { viewIntervalId, commentIntervalId, isProcessing, displayedComments, ...rest } = video
            return { ...rest, isProcessing: false, displayedComments: [] }
          }),
        })),
      }
      localStorage.setItem("punstaSimState", JSON.stringify(stateToSave)) // Renamed localStorage key
      console.log("Game state saved to localStorage.")
    } catch (error) {
      console.error("Failed to save game state to localStorage:", error)
      toast({
        title: "Save Error",
        description: "Failed to save game progress. Your browser's storage might be full.",
        variant: "destructive",
      })
    }
  }, [gameState, toast])

  const addVideo = useCallback(
    (
      newVideoData: Omit<
        Video,
        | "id"
        | "uploadDate"
        | "currentViews"
        | "currentLikes"
        | "currentDislikes"
        | "displayedComments"
        | "analytics"
        | "viewIntervalId"
        | "commentIntervalId"
      >,
    ) => {
      setGameState((prev) => {
        const id = `vid-${Date.now()}`
        const uploadDate = new Date().toISOString().split("T")[0]

        const qualityMultiplier = QUALITY_MULTIPLIERS[newVideoData.quality] || 1.0
        const typeMultiplier = TYPE_MULTIPLIERS[newVideoData.type] || 1.0
        const editingSkillMultiplier =
          PUN_EDITING_SKILL_COSTS.find((s) => s.level === prev.channel.punEditingSkill)?.multiplier || 1.0
        const overallMultiplier = qualityMultiplier * typeMultiplier * editingSkillMultiplier

        // Enhanced randomness for initial views
        const baseViewsFromSubs = Math.floor(prev.channel.subscribers * (Math.random() * 0.2 + 0.02)) // 2% to 22% of subscribers
        const adBoostViews = prev.channel.hasAdvertised ? Math.floor(Number(prev.channel.money) / 1000) * 100 : 0 // Existing ad boost

        const initialViews =
          Math.max(
            1000, // Minimum initial views
            baseViewsFromSubs + adBoostViews * (Math.random() * 0.5 + 0.75), // Apply ad boost with some randomness
          ) * overallMultiplier // Apply quality, type, and editing skill multipliers

        const initialLikes = Math.max(100, Math.floor(initialViews * (Math.random() * 0.05 + 0.05)))
        const initialDislikes = Math.max(10, Math.floor(initialViews * (Math.random() * 0.005 + 0.001)))
        const totalComments = generateRandomComments(Math.floor(initialViews / 500) + 10)
        const analytics = generateRandomAnalytics(initialViews)

        const newVideo: Video = {
          ...newVideoData,
          id,
          uploadDate,
          initialViews,
          currentViews: initialViews,
          initialLikes,
          currentLikes: initialLikes,
          initialDislikes,
          currentDislikes: initialDislikes,
          totalComments,
          displayedComments: [],
          analytics,
          isProcessing: true,
        }

        setTimeout(() => {
          setGameState((current) => {
            const updatedVideos = current.channel.videos.map((v) =>
              v.id === newVideo.id ? { ...v, isProcessing: false } : v,
            )
            const videoToSimulate = updatedVideos.find((v) => v.id === newVideo.id)
            if (videoToSimulate) {
              startVideoSimulation(videoToSimulate, "player")
            }
            return {
              ...current,
              channel: {
                ...current.channel,
                videos: updatedVideos,
              },
            }
          })
        }, 3000)

        return {
          ...prev,
          channel: {
            ...prev.channel,
            videos: [...prev.channel.videos, newVideo],
          },
        }
      })
    },
    [startVideoSimulation],
  )

  const addPlaylist = useCallback((newPlaylistData: Omit<Playlist, "id" | "thumbnail">) => {
    setGameState((prev) => {
      const id = `pl-${Date.now()}`
      const thumbnailVideo = prev.channel.videos.find((v) => newPlaylistData.videoIds.includes(v.id))
      const thumbnail = thumbnailVideo ? thumbnailVideo.thumbnail : "/placeholder.svg?height=180&width=320"

      const newPlaylist: Playlist = {
        ...newPlaylistData,
        id,
        thumbnail,
      }
      return {
        ...prev,
        channel: {
          ...prev.channel,
          playlists: [...prev.channel.playlists, newPlaylist],
        },
      }
    })
  }, [])

  const addPost = useCallback((content: string) => {
    setGameState((prev) => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        content,
        timestamp: new Date().toISOString(),
        likes: Math.floor(Math.random() * 50) + 10, // Initial likes
        comments: Math.floor(Math.random() * 10) + 2, // Initial comments
      }
      return {
        ...prev,
        channel: {
          ...prev.channel,
          posts: [newPost, ...prev.channel.posts], // Add new post to the beginning
        },
      }
    })
  }, [])

  const runAdCampaign = useCallback(
    (budget: number) => {
      setGameState((prev) => {
        const MAX_AD_BUDGET = 100_000_000 // $100 million
        if (prev.channel.hasAdvertised || budget <= 0 || budget > prev.channel.money || budget > MAX_AD_BUDGET) {
          toast({
            title: "Ad Campaign Failed",
            description: `Budget must be positive, within your money, and not exceed $${MAX_AD_BUDGET.toLocaleString()}.`,
            variant: "destructive",
          })
          return prev
        }
        const newSubscribers = Math.floor(budget / 10)
        return {
          ...prev,
          channel: {
            ...prev.channel,
            money: prev.channel.money - budget,
            subscribers: prev.channel.subscribers + newSubscribers,
            hasAdvertised: true,
          },
        }
      })
    },
    [toast],
  )

  const startGame = useCallback(
    (channelName: string) => {
      setGameState({
        channel: {
          ...initialChannelDataTemplate,
          name: channelName,
          handle: `@${channelName.replace(/\s/g, "")}Official`, // Generate handle from name
          analyticsHistory: [{ date: new Date().toISOString().split("T")[0], views: 0, subscribers: 0, likes: 0 }], // Initial analytics entry
        },
        otherChannels: initialOtherChannels, // Re-initialize other channels
        isGameStarted: true,
      })
      localStorage.removeItem("punstaSimState") // Clear any old state
      toast({
        title: "Game Started!",
        description: `Welcome, ${channelName}! Your journey to rap stardom begins.`,
      })
    },
    [toast],
  )

  const trainPunEditingSkill = useCallback(() => {
    setGameState((prev) => {
      const currentLevel = prev.channel.punEditingSkill
      const nextLevelData = PUN_EDITING_SKILL_COSTS.find((s) => s.level === currentLevel + 1)

      if (!nextLevelData) {
        toast({
          title: "Skill Maxed Out",
          description: "Your Pun Editing Skill is already at its maximum level!",
          variant: "default",
        })
        return prev
      }

      if (prev.channel.money < nextLevelData.cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need $${nextLevelData.cost.toLocaleString()} to train this skill.`,
          variant: "destructive",
        })
        return prev
      }

      toast({
        title: "Pun Editing Skill Leveled Up!",
        description: `You spent $${nextLevelData.cost.toLocaleString()} and reached Level ${nextLevelData.level}. Your future puns will perform better!`,
      })

      return {
        ...prev,
        channel: {
          ...prev.channel,
          money: prev.channel.money - nextLevelData.cost,
          punEditingSkill: nextLevelData.level,
        },
      }
    })
  }, [toast])

  const value = React.useMemo(
    () => ({
      gameState,
      setGameState,
      addVideo,
      addPlaylist,
      addPost,
      runAdCampaign,
      updateVideoStats,
      startGame,
      trainPunEditingSkill,
    }),
    [
      gameState,
      setGameState,
      addVideo,
      addPlaylist,
      addPost,
      runAdCampaign,
      updateVideoStats,
      startGame,
      trainPunEditingSkill,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
