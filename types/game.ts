import type React from "react"

export interface Comment {
  id: string
  user: string
  text: string
  timeAgo: string
}

export interface Analytics {
  countryStats: { [country: string]: number }
  cityStats: { [city: string]: number }
  engagement: {
    averageViewDuration: number
    clickThroughRate: number
    likesToViewsRatio: number
    dislikesToViewsRatio: number
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
  currentDislikes: number
  totalComments: Comment[]
  displayedComments: Comment[]
  analytics: Analytics
  isProcessing?: boolean
  viewIntervalId?: NodeJS.Timeout | null
  commentIntervalId?: NodeJS.Timeout | null
  type: "video" | "release"
  quality: 1 | 2 | 3 | 4 | 5
  videoFileName?: string
  videoFileSize?: number
}

export interface Post {
  id: string
  content: string
  timestamp: string
  likes: number
  comments: number
}

export interface Playlist {
  id: string
  title: string
  description: string
  videoIds: string[]
  thumbnail: string
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
  posts: Post[]
  bio: string
  isVerified: boolean
}

export interface PlayerChannel extends BaseChannel {
  money: number
  hasAdvertised: boolean
  homepageLayout: string[]
  milestones: string[]
  analyticsHistory: {
    date: string
    views: number
    subscribers: number
    likes: number
  }[]
  punEditingSkill: number
}

export interface OtherChannel extends BaseChannel {
  // Other channels might have fewer simulation-specific properties
}

export interface GameState {
  channel: PlayerChannel
  otherChannels: OtherChannel[]
  isGameStarted: boolean
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
  addPost: (content: string) => void
  runAdCampaign: (budget: number) => void
  updateVideoStats: (videoId: string, updates: Partial<Video>) => void
  startGame: (channelName: string, subscriberCount?: number) => void
  trainPunEditingSkill: () => void
}

export interface SidebarContextType {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}
