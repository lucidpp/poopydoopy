// lib/game-data.ts
import type { Comment, Analytics, PlayerChannel, OtherChannel } from "@/types/game"

export const generateRandomComments = (count: number): Comment[] => {
  const comments = [
    "This beat is fire! 🔥",
    "Bars are on point, keep it up!",
    "Underrated artist, subscribed!",
    "Nah, not feeling this one.",
    "Got this on repeat!",
    "The storytelling here is incredible.",
    "Future of rap right here.",
    "Reminds me of classic hip-hop, love it!",
    "So fresh, so clean.",
    "First!",
    "There's a lot of depth in these lyrics.",
    "Perfect for a late-night drive.",
    "Needs more originality.",
    "Been following since day one, proud of your growth!",
    "Mix is clean, production is top-notch.",
    "This is a masterpiece!",
    "Can't wait for the next one!",
    "You're inspiring me to make music.",
    "The visuals are amazing too!",
    "Not my cup of tea.",
    "Who's listening in 2025?",
    "This song changed my life.",
    "So much talent!",
    "Keep grinding!",
    "Love the energy!",
  ]
  const users = [
    "BeatMasterFlex",
    "RhymeSlinger",
    "MusicLover22",
    "HaterGonnaHate",
    "VibeChecker",
    "LyricAnalyst",
    "TrendSetter",
    "OldSchoolFan",
    "NewGen",
    "RandomDude",
    "DeepThinker",
    "ChillVibes",
    "CritiqueKing",
    "FanForLife",
    "SoundEngineer",
    "RapGod",
    "FlowState",
    "MicCheck",
    "GrooveGuru",
    "TuneTrooper",
  ]

  const generated: Comment[] = []
  for (let i = 0; i < count; i++) {
    generated.push({
      id: `c${Date.now()}-${i}`,
      user: users[Math.floor(Math.random() * users.length)],
      text: comments[Math.floor(Math.random() * comments.length)],
      timeAgo: "just now", // Will be updated by simulation
    })
  }
  return generated
}

export const generateRandomAnalytics = (views: number): Analytics => {
  const countries = ["USA", "Canada", "UK", "Germany", "France", "Australia", "Brazil", "India", "Japan", "Mexico"]
  const cities = [
    "New York",
    "Los Angeles",
    "London",
    "Toronto",
    "Berlin",
    "Paris",
    "Sydney",
    "Rio de Janeiro",
    "Mumbai",
    "Tokyo",
    "Chicago",
    "Houston",
    "Mexico City",
    "São Paulo",
    "Delhi",
  ]

  const countryStats: { [key: string]: number } = {}
  let remainingViews = views
  countries.forEach((country) => {
    // Ensure all countries get some views, then distribute remaining
    const minViews = Math.min(remainingViews / countries.length / 2, 50)
    const countryViews = Math.floor(Math.random() * (remainingViews / 5)) + minViews
    countryStats[country] = countryViews
    remainingViews -= countryViews
  })
  // Distribute any remaining views
  while (remainingViews > 0) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]
    const add = Math.min(remainingViews, Math.floor(Math.random() * 100) + 1)
    countryStats[randomCountry] = (countryStats[randomCountry] || 0) + add
    remainingViews -= add
  }

  const cityStats: { [key: string]: number } = {}
  let remainingCityViews = views
  cities.forEach((city) => {
    const minViews = Math.min(remainingCityViews / cities.length / 2, 30)
    const cityViews = Math.floor(Math.random() * (remainingCityViews / 7)) + minViews
    cityStats[city] = cityViews
    remainingCityViews -= cityViews
  })
  while (remainingCityViews > 0) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)]
    const add = Math.min(remainingCityViews, Math.floor(Math.random() * 50) + 1)
    cityStats[randomCity] = (cityStats[randomCity] || 0) + add
    remainingCityViews -= add
  }

  const averageViewDuration = Math.floor(Math.random() * (views > 100000 ? 600 : 180)) + 60 // 1-10 mins
  const clickThroughRate = Number.parseFloat((Math.random() * 3 + 4).toFixed(2)) // 4-7%
  const likesToViewsRatio = Number.parseFloat((Math.random() * 8 + 8).toFixed(2)) // 8-16%
  const dislikesToViewsRatio = Number.parseFloat((Math.random() * 1.5 + 0.2).toFixed(2)) // 0.2-1.7%

  return {
    countryStats,
    cityStats,
    engagement: {
      averageViewDuration,
      clickThroughRate,
      likesToViewsRatio,
      dislikesToViewsRatio,
    },
  }
}

export const initialChannelDataTemplate: PlayerChannel = {
  id: "my-rapper-profile",
  name: "Default Punster", // This will be replaced by user input
  handle: "@PunstaPro",
  avatar: "/placeholder.svg?height=100&width=100",
  banner: "/placeholder.svg?height=200&width=1200",
  subscribers: 0,
  totalViews: 0,
  videos: [],
  playlists: [],
  posts: [], // Initialize posts array
  money: 20000000, // Increased initial budget to $20,000,000
  hasAdvertised: false,
  isVerified: true, // Player's punster profile is verified
  bio: "Welcome to the official Punster Profile of the hottest new rap artist! Here you'll find the sickest beats, rawest lyrics, and freshest puns. Subscribe for new music every week and join the Punsta Fam!",
  homepageLayout: ["latestVideos", "popularVideos", "playlists"],
  milestones: [], // Initialize empty milestones
  analyticsHistory: [], // Initialize empty analytics history
  punEditingSkill: 1, // Initial pun editing skill level
}

export const initialCoryxKenshinChannelData: OtherChannel = {
  id: "coryxkenshin",
  name: "CoryxKenshin",
  handle: "@CoryxKenshin",
  avatar: "/images/coryxkenshin_avatar.jpg",
  banner: "/images/coryxkenshin_banner.png",
  subscribers: 22600000, // 22.6 Million
  totalViews: 1500000000, // 1.5 Billion views for his single video
  isVerified: true,
  bio: "The Shogun himself. Known for his intense gameplay, horror game reactions, and samurai-like wisdom. The ultimate content creator.",
  videos: [
    {
      id: "cory-sps-video",
      title: "SPS 9",
      description: "My last SPS video...",
      thumbnail: "/placeholder.svg?height=180&width=320",
      uploadDate: "Oct 8, 2019",
      initialViews: 100000000, // 100 million
      currentViews: 100000000,
      initialLikes: 5000000, // 5 million
      currentLikes: 5000000,
      initialDislikes: 50000, // 50 thousand
      currentDislikes: 50000,
      totalComments: generateRandomComments(5000), // Lots of comments
      displayedComments: generateRandomComments(50), // Initial display
      analytics: generateRandomAnalytics(100000000),
      type: "video",
      quality: 5, // Masterpiece
      videoFileName: "SPS9.mp4",
      videoFileSize: 500 * 1024 * 1024, // 500MB
    },
  ],
  playlists: [],
  posts: [
    {
      id: "cory-post-1",
      content: "Thank you all for the incredible support over the years. Shogun out.",
      timestamp: "2019-10-08T12:00:00Z", // Same date as last video
      likes: 1000000,
      comments: 50000,
    },
  ],
}

export const initialOtherChannels: OtherChannel[] = [
  initialCoryxKenshinChannelData,
  // Add other predefined channels here in the future
]

export const MILESTONES = [
  { id: "subs-100", type: "subscribers", threshold: 100, message: "100 Subscribers!" },
  { id: "subs-1k", type: "subscribers", threshold: 1000, message: "1,000 Subscribers! Keep it up!" },
  { id: "subs-10k", type: "subscribers", threshold: 10000, message: "10,000 Subscribers! You're growing fast!" },
  {
    id: "subs-100k",
    type: "subscribers",
    threshold: 100000,
    message: "100,000 Subscribers! Almost a silver play button!",
  },
  { id: "subs-1m", type: "subscribers", threshold: 1000000, message: "1,000,000 Subscribers! You're a Punsta star!" },
  { id: "views-1k", type: "views", threshold: 1000, message: "1,000 Total Views!" },
  { id: "views-10k", type: "views", threshold: 10000, message: "10,000 Total Views!" },
  {
    id: "views-100k",
    type: "views",
    threshold: 100000,
    message: "100,000 Total Views! Your content is reaching many!",
  },
  { id: "views-1m", type: "views", threshold: 1000000, message: "1,000,000 Total Views! Incredible reach!" },
  { id: "views-10m", type: "views", threshold: 10000000, message: "10,000,000 Total Views! Massive success!" },
]

export const PUN_EDITING_SKILL_COSTS = [
  { level: 1, cost: 0, multiplier: 1.0 },
  { level: 2, cost: 5000, multiplier: 1.1 },
  { level: 3, cost: 25000, multiplier: 1.25 },
  { level: 4, cost: 100000, multiplier: 1.5 },
  { level: 5, cost: 500000, multiplier: 2.0 },
]
