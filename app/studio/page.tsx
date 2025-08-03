// app/studio/page.tsx
"use client"

import { useGame } from "@/components/game-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Eye, ThumbsUp, MessageSquare, ThumbsDown, AwardIcon, TrendingUpIcon, EditIcon } from "lucide-react" // Added EditIcon
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { MILESTONES, PUN_EDITING_SKILL_COSTS } from "@/lib/game-data" // Import PUN_EDITING_SKILL_COSTS
import { Button } from "@/components/ui/button"

export default function StudioPage() {
  const { gameState, trainPunEditingSkill } = useGame()
  const channel = gameState.channel

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toString()
  }

  // Aggregate analytics across all videos
  const aggregatedCountryStats: { [country: string]: number } = {}
  const aggregatedCityStats: { [city: string]: number } = {}
  let totalLikes = 0
  let totalDislikes = 0
  let totalComments = 0
  let totalAverageViewDuration = 0
  let videoCountWithDuration = 0

  channel.videos.forEach((video) => {
    Object.entries(video.analytics.countryStats).forEach(([country, views]) => {
      aggregatedCountryStats[country] = (aggregatedCountryStats[country] || 0) + views
    })
    Object.entries(video.analytics.cityStats).forEach(([city, views]) => {
      aggregatedCityStats[city] = (aggregatedCityStats[city] || 0) + views
    })
    totalLikes += video.currentLikes
    totalDislikes += video.currentDislikes
    totalComments += video.displayedComments.length
    if (video.analytics.engagement.averageViewDuration > 0) {
      totalAverageViewDuration += video.analytics.engagement.averageViewDuration
      videoCountWithDuration++
    }
  })

  const sortedCountryStats = Object.entries(aggregatedCountryStats).sort(([, a], [, b]) => b - a)
  const sortedCityStats = Object.entries(aggregatedCityStats).sort(([, a], [, b]) => b - a)

  const overallAverageViewDuration = videoCountWithDuration > 0 ? totalAverageViewDuration / videoCountWithDuration : 0
  const overallLikesToViewsRatio = channel.totalViews > 0 ? (totalLikes / channel.totalViews) * 100 : 0
  const overallDislikesToViewsRatio = channel.totalViews > 0 ? (totalDislikes / channel.totalViews) * 100 : 0

  // Prepare data for charts
  const chartData = channel.analyticsHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    views: entry.views,
    subscribers: entry.subscribers,
    likes: entry.likes,
  }))

  const achievedMilestones = MILESTONES.filter((m) => channel.milestones.includes(m.id))
  const upcomingMilestones = MILESTONES.filter((m) => !channel.milestones.includes(m.id)).sort((a, b) => {
    if (a.type === b.type) return a.threshold - b.threshold
    return a.type === "subscribers" ? -1 : 1 // Prioritize subscribers
  })

  const currentEditingSkillLevel = channel.punEditingSkill
  const nextEditingSkillLevelData = PUN_EDITING_SKILL_COSTS.find((s) => s.level === currentEditingSkillLevel + 1)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Punsta Studio</h1> {/* Renamed title */}
      <Card>
        <CardHeader>
          <CardTitle>Punster Profile Dashboard</CardTitle> {/* Renamed title */}
          <CardDescription>Overview of your Punster Profile's performance.</CardDescription> {/* Renamed text */}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{formatNumber(channel.subscribers)}</span>
            <span className="text-sm text-muted-foreground">Subscribers</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
            <Eye className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold">{formatNumber(channel.totalViews)}</span>
            <span className="text-sm text-muted-foreground">Total Views</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold">{formatNumber(totalLikes)}</span>
            <span className="text-sm text-muted-foreground">Total Likes</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
            <MessageSquare className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold">{formatNumber(totalComments)}</span>
            <span className="text-sm text-muted-foreground">Total Comments</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Punster Profile Growth</CardTitle> {/* Renamed title */}
          <CardDescription>Track your views, subscribers, and likes over time.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 1 ? (
            <ChartContainer
              config={{
                views: { label: "Views", color: "hsl(var(--chart-1))" },
                subscribers: { label: "Subscribers", color: "hsl(var(--chart-2))" },
                likes: { label: "Likes", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={30}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tickFormatter={(value) => formatNumber(value)} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Legend />
                  <Line dataKey="views" type="monotone" stroke="var(--color-views)" strokeWidth={2} dot={false} />
                  <Line
                    dataKey="subscribers"
                    type="monotone"
                    stroke="var(--color-subscribers)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line dataKey="likes" type="monotone" stroke="var(--color-likes)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              Upload more Puns and wait for daily updates to see your Punster Profile growth here! {/* Renamed text */}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pun Editing Skills</CardTitle> {/* New Card */}
          <CardDescription>Improve your ability to create high-performing Puns.</CardDescription> {/* New Card */}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <EditIcon className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">Level {currentEditingSkillLevel}</span>
            {nextEditingSkillLevelData && (
              <span className="text-sm text-muted-foreground">
                (Next: Level {nextEditingSkillLevelData.level} for ${nextEditingSkillLevelData.cost.toLocaleString()})
              </span>
            )}
          </div>
          <Progress value={(currentEditingSkillLevel / PUN_EDITING_SKILL_COSTS.length) * 100} className="w-full h-2" />
          <Button onClick={trainPunEditingSkill} disabled={!nextEditingSkillLevelData}>
            {nextEditingSkillLevelData
              ? `Train Skill ($${nextEditingSkillLevelData.cost.toLocaleString()})`
              : "Skill Maxed!"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Higher skill levels lead to better initial views, likes, and comments on your new Puns.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Milestones & Achievements</CardTitle>
          <CardDescription>Celebrate your progress and see what's next!</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AwardIcon className="h-5 w-5 text-yellow-500" /> Achieved Milestones
            </h3>
            {achievedMilestones.length === 0 ? (
              <p className="text-muted-foreground">No milestones achieved yet. Keep creating!</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {achievedMilestones.map((milestone) => (
                  <li key={milestone.id} className="text-green-400 font-medium">
                    {milestone.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-blue-500" /> Upcoming Milestones
            </h3>
            {upcomingMilestones.length === 0 ? (
              <p className="text-muted-foreground">You've achieved all current milestones! More coming soon.</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {upcomingMilestones.slice(0, 5).map((milestone) => (
                  <li key={milestone.id} className="text-muted-foreground">
                    {milestone.message} (Current:{" "}
                    {milestone.type === "subscribers"
                      ? formatNumber(channel.subscribers)
                      : formatNumber(channel.totalViews)}
                    /{formatNumber(milestone.threshold)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Engagement</CardTitle>
          <CardDescription>How viewers are interacting with your content.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Average Pun Duration</h3> {/* Renamed text */}
            <p className="text-2xl font-bold">
              {Math.floor(overallAverageViewDuration / 60)}m {Math.floor(overallAverageViewDuration % 60)}s
            </p>
            <p className="text-sm text-muted-foreground">Average time viewers spent watching your Puns.</p>{" "}
            {/* Renamed text */}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Likes vs. Dislikes</h3>
            <div className="flex items-center gap-2">
              <ThumbsUp className="text-green-500" />
              <Progress value={overallLikesToViewsRatio} className="w-full" />
              <span className="text-sm">{overallLikesToViewsRatio.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <ThumbsDown className="text-red-500" />
              <Progress value={overallDislikesToViewsRatio} className="w-full" />
              <span className="text-sm">{overallDislikesToViewsRatio.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Audience Geography</CardTitle>
          <CardDescription>Where your viewers are located.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Top Countries</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCountryStats.slice(0, 5).map(([country, views]) => (
                  <TableRow key={country}>
                    <TableCell>{country}</TableCell>
                    <TableCell className="text-right">{formatNumber(views)}</TableCell>
                  </TableRow>
                ))}
                {sortedCountryStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No country data yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Top Cities</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCityStats.slice(0, 5).map(([city, views]) => (
                  <TableRow key={city}>
                    <TableCell>{city}</TableCell>
                    <TableCell className="text-right">{formatNumber(views)}</TableCell>
                  </TableRow>
                ))}
                {sortedCityStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No city data yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latest Pun Performance</CardTitle> {/* Renamed title */}
          <CardDescription>Quick stats for your most recent uploads.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pun Title</TableHead> {/* Renamed title */}
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Dislikes</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channel.videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No Puns uploaded yet. {/* Renamed text */}
                  </TableCell>
                </TableRow>
              ) : (
                channel.videos
                  .slice(-5)
                  .reverse()
                  .map(
                    (
                      video, // Show last 5 videos
                    ) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{formatNumber(video.currentViews)}</TableCell>
                        <TableCell>{formatNumber(video.currentLikes)}</TableCell>
                        <TableCell>{formatNumber(video.currentDislikes)}</TableCell>
                        <TableCell>{formatNumber(video.displayedComments.length)}</TableCell>
                      </TableRow>
                    ),
                  )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
