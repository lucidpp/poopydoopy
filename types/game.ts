import type React from "react"
// types/game.ts
export interface Comment {
  id: string
  user: string
  text: string
  timeAgo: string
}

export interface Analytics {
  countryStats: { [country: string]: number } // e.g., { "USA": 1000, "Canada": 500 }
  cityStats: { [city: string]: number } // e.g., { "New York": 300, "Los Angeles": 200 }
  engagement: {
    averageViewDuration: number // in seconds
    clickThroughRate: number // percentage
    likesToViewsRatio: number // percentage
    dislikesToViewsRatio: number // percentage
  }
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  uploadDate: string
  initialViews: number
  currentViews: number
  initialLikes: number
  currentLikes: number
  initialDislikes: number
  totalComments: Comment[]
  displayedComments: Comment[]
  analytics: Analytics
  isProcessing?: boolean // For upload simulation
  viewIntervalId?: NodeJS.Timeout | null
  commentIntervalId?: NodeJS.Timeout | null
  type: "video" | "release" // Added: type of content
  quality: 1 | 2 | 3 | 4 | 5 // Added: popularity/quality level (1=Poor, 5=Masterpiece)
  videoFileName?: string // Added: for local MP4 simulation
  videoFileSize?: number // Added: for local MP4 simulation
}

export interface Post {
  id: string
  content: string
  timestamp: string // ISO string
  likes: number
  comments: number
}

export interface Playlist {
  id: string
  title: string
  description: string
  videoIds: string[]
  thumbnail: string // Thumbnail of the first video in the playlist
}

export interface BaseChannel {
  id: string
  name: string
  handle: string
  avatar: string
  banner: string
  subscribers: number
  totalViews: number
  videos: Video[]
  playlists: Playlist[]
  posts: Post[] // Added: for punster profile posts
  bio: string // For about section
  isVerified: boolean
}

export interface PlayerChannel extends BaseChannel {
  money: number
  hasAdvertised: boolean
  homepageLayout: string[] // Added: for customizable homepage sections
  milestones: string[] // Added: for achieved milestones
  analyticsHistory: {
    date: string
    views: number
    subscribers: number
    likes: number
  }[] // Added: for studio charts
  punEditingSkill: number // Added: for video editing skill
}

export interface OtherChannel extends BaseChannel {
  // Other channels might have fewer simulation-specific properties
  // For now, they can be a subset of PlayerChannel, or have their own unique properties if needed.
}

export interface GameState {
  channel: PlayerChannel // Player's channel
  otherChannels: OtherChannel[] // Other channels in the game world
  isGameStarted: boolean // Added: to control pre-game setup
}

export interface GameContextType {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  addVideo: (
    video: Omit<
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
  ) => void
  addPlaylist: (playlist: Omit<Playlist, "id" | "thumbnail">) => void
  addPost: (content: string) => void // Added: for adding posts
  runAdCampaign: (budget: number) => void
  updateVideoStats: (videoId: string, updates: Partial<Video>) => void
  startGame: (channelName: string) => void // Added: to start the game with a channel name
  trainPunEditingSkill: () => void // Added: to train editing skill
}

export interface SidebarContextType {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}
