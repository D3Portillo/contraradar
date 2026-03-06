"use client"

import React from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingUp,
  Zap,
  Target,
  BarChart2,
  Clock,
  Briefcase,
  Code2,
  Palette,
  PenTool,
  Globe,
  Database,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FeatureGate } from "@/components/shared/FeatureGate"
import { useUser } from "@/hooks/useUser"

const STATS = [
  {
    label: "Skills Tracked",
    value: "247",
    change: "+12 this week",
    trend: "up" as const,
    icon: BarChart2,
  },
  {
    label: "Trending Now",
    value: "18",
    change: "+5 since yesterday",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    label: "Market Score",
    value: "8.4",
    change: "0.2 from last week",
    trend: "neutral" as const,
    icon: Target,
  },
  {
    label: "Profile Matches",
    value: "34",
    change: "-3 this week",
    trend: "down" as const,
    icon: Zap,
  },
]

const TRENDING_SKILLS: Array<{
  skill: string
  demand: number
  trend: "up" | "down" | "neutral"
  category: string
  icon: React.ElementType
}> = [
  { skill: "AI Prompt Engineering", demand: 94, trend: "up", category: "AI/ML", icon: Code2 },
  { skill: "Next.js Development", demand: 88, trend: "up", category: "Web Dev", icon: Globe },
  { skill: "Product Design (Figma)", demand: 82, trend: "up", category: "Design", icon: Palette },
  { skill: "Data Analysis", demand: 77, trend: "neutral", category: "Data", icon: Database },
  { skill: "Copywriting", demand: 71, trend: "up", category: "Content", icon: PenTool },
  { skill: "Brand Strategy", demand: 65, trend: "down", category: "Marketing", icon: Briefcase },
  { skill: "React Native", demand: 63, trend: "up", category: "Mobile", icon: Code2 },
  { skill: "SEO Optimization", demand: 58, trend: "neutral", category: "Marketing", icon: Globe },
]

const SIGNALS = [
  {
    title: "AI/ML skills surged 34% this week",
    detail: "Demand for AI Prompt Engineering and LLM fine-tuning reached an all-time high.",
    time: "2h ago",
    type: "spike",
  },
  {
    title: "New category added: Blockchain",
    detail: "Smart contract development is gaining traction among Contra clients.",
    time: "5h ago",
    type: "new",
  },
  {
    title: "Figma demand stabilizing",
    detail: "Product design requests leveled off after a two-week growth streak.",
    time: "1d ago",
    type: "neutral",
  },
  {
    title: "Copywriting dipped slightly",
    detail: "General copywriting requests down 8% — long-form and SEO copy still strong.",
    time: "1d ago",
    type: "drop",
  },
  {
    title: "Next.js remains top web skill",
    detail: "React/Next.js continues to dominate front-end client requests on Contra.",
    time: "2d ago",
    type: "steady",
  },
]

const SIGNAL_COLORS: Record<string, string> = {
  spike: "bg-green-500/10 text-green-600 border-green-200",
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  neutral: "bg-muted text-muted-foreground border-border",
  drop: "bg-red-500/10 text-red-600 border-red-200",
  steady: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
}

const SIGNAL_LABELS: Record<string, string> = {
  spike: "Spike",
  new: "New",
  neutral: "Flat",
  drop: "Drop",
  steady: "Steady",
}

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-green-500" />
  if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-red-500" />
  return <Minus className="w-4 h-4 text-muted-foreground" />
}

function DemandBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-6 text-right">{value}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Market Overview</h2>
        <p className="text-muted-foreground">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! Here&apos;s what&apos;s trending on Contra today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  {stat.label}
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendIcon trend={stat.trend} />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Trending Skills Table — pro feature */}
        <FeatureGate requiredTier="pro">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trending Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-[1fr_auto_80px_auto] gap-4 pb-2 border-b text-xs font-medium text-muted-foreground">
                    <span>Skill</span>
                    <span>Category</span>
                    <span>Demand</span>
                    <span className="text-right">Trend</span>
                  </div>
                  {TRENDING_SKILLS.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.skill}
                        className="grid grid-cols-[1fr_auto_80px_auto] gap-4 items-center py-2.5 border-b last:border-0"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium truncate">{item.skill}</span>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {item.category}
                        </Badge>
                        <DemandBar value={item.demand} />
                        <TrendIcon trend={item.trend} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </FeatureGate>

        {/* Market Signals feed */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Market Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SIGNALS.map((signal) => (
                  <div key={signal.title} className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{signal.title}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${SIGNAL_COLORS[signal.type]}`}
                      >
                        {SIGNAL_LABELS[signal.type]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{signal.detail}</p>
                    <p className="text-xs text-muted-foreground/60">{signal.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Categories This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "AI / Machine Learning", share: 28 },
                { name: "Web Development", share: 22 },
                { name: "Design & UX", share: 17 },
                { name: "Content & Copy", share: 13 },
                { name: "Data & Analytics", share: 11 },
                { name: "Other", share: 9 },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.share}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full"
                      style={{ width: `${cat.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions / tips */}
        <FeatureGate requiredTier="pro">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Opportunity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">8.4</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Strong Match</p>
                  <p className="text-xs text-muted-foreground">
                    Your profile aligns with 34 active demand signals this week.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Suggested actions
                </p>
                {[
                  "Add AI Prompt Engineering to your profile",
                  "Highlight Next.js projects in your portfolio",
                  "Update your Data Analysis availability",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2 text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FeatureGate>
      </div>
    </div>
  )
}
