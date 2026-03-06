"use client"

import React from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingUp,
  Target,
  BarChart2,
  Users,
  Zap,
  Layers,
  Palette,
  Code2,
  BookOpen,
  Sparkles,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FeatureGate } from "@/components/shared/FeatureGate"
import { useUser } from "@/hooks/useUser"

// ─── Types ────────────────────────────────────────────────────────────────────

type Trend = "up" | "down" | "neutral"

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Products Tracked",
    value: "48",
    change: "+6 this week",
    trend: "up" as Trend,
    icon: BarChart2,
  },
  {
    label: "Hot Opportunities",
    value: "12",
    change: "+3 since yesterday",
    trend: "up" as Trend,
    icon: TrendingUp,
  },
  {
    label: "Avg. Demand Score",
    value: "74",
    change: "±2 from last week",
    trend: "neutral" as Trend,
    icon: Target,
  },
  {
    label: "Experts in Demand",
    value: "1.8k",
    change: "+230 this month",
    trend: "up" as Trend,
    icon: Users,
  },
]

// ─── Rising products table (free) ─────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "No-Code": Layers,
  "AI Builder": Sparkles,
  Design: Palette,
  "Dev Tools": Code2,
  Productivity: BookOpen,
  Automation: Zap,
}

const RISING_PRODUCTS: Array<{
  name: string
  score: number
  trend: Trend
  category: string
}> = [
  { name: "Framer", score: 92, trend: "up", category: "No-Code" },
  { name: "Lovable", score: 88, trend: "up", category: "AI Builder" },
  { name: "Webflow", score: 84, trend: "up", category: "No-Code" },
  { name: "Figma", score: 81, trend: "neutral", category: "Design" },
  { name: "v0 by Vercel", score: 76, trend: "up", category: "AI Builder" },
  { name: "Notion", score: 72, trend: "neutral", category: "Productivity" },
  { name: "Cursor", score: 69, trend: "up", category: "Dev Tools" },
  { name: "Supabase", score: 65, trend: "up", category: "Dev Tools" },
  { name: "Bubble", score: 61, trend: "down", category: "No-Code" },
  { name: "Zapier", score: 58, trend: "neutral", category: "Automation" },
]

// ─── Hiring insights (pro) ────────────────────────────────────────────────────

// Demo/mock data — replace with real API values when analytics service is available
const HIRING_INSIGHTS: Array<{
  name: string
  openRoles: number
  avgRate: string
  competition: string
  growth: string
  trend: Trend
}> = [
  { name: "Framer", openRoles: 43, avgRate: "$85/hr", competition: "Low", growth: "+28%", trend: "up" },
  { name: "Lovable", openRoles: 31, avgRate: "$90/hr", competition: "Very Low", growth: "+41%", trend: "up" },
  { name: "v0 by Vercel", openRoles: 24, avgRate: "$95/hr", competition: "Very Low", growth: "+65%", trend: "up" },
  { name: "Webflow", openRoles: 87, avgRate: "$75/hr", competition: "Medium", growth: "+18%", trend: "up" },
  { name: "Cursor", openRoles: 28, avgRate: "$100/hr", competition: "Low", growth: "+34%", trend: "up" },
  { name: "Figma", openRoles: 112, avgRate: "$80/hr", competition: "High", growth: "+8%", trend: "neutral" },
  { name: "Supabase", openRoles: 19, avgRate: "$88/hr", competition: "Low", growth: "+29%", trend: "up" },
  { name: "Bubble", openRoles: 34, avgRate: "$70/hr", competition: "Medium", growth: "-9%", trend: "down" },
]

const COMPETITION_COLOR: Record<string, string> = {
  "Very Low": "bg-green-500/10 text-green-700 border-green-200",
  Low: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  Medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  High: "bg-red-500/10 text-red-600 border-red-200",
}

// ─── Market signals (free) ────────────────────────────────────────────────────

const SIGNALS = [
  {
    title: "Lovable expertise in high demand",
    detail: "AI app builder requests grew 41% — 210 new hire posts this month with very few specialists available.",
    time: "3h ago",
    type: "spike",
  },
  {
    title: "Framer overtaking Webflow in no-code",
    detail: "Framer postings up 28% as brands shift to interactive micro-sites. Avg rate holding at $85/hr.",
    time: "8h ago",
    type: "spike",
  },
  {
    title: "v0 by Vercel — early-mover advantage",
    detail: "Only 145 v0 specialists on Contra. Clients are paying $95+ for experts who can ship fast.",
    time: "1d ago",
    type: "new",
  },
  {
    title: "Bubble demand cooling slightly",
    detail: "No-code app requests dipped 9% this week. Zapier automation work partially absorbing the gap.",
    time: "1d ago",
    type: "drop",
  },
  {
    title: "Figma demand remains steady",
    detail: "Design team subscriptions signal sustained Figma hiring through Q3 — 112 open roles on Contra.",
    time: "2d ago",
    type: "steady",
  },
]

const SIGNAL_COLORS: Record<string, string> = {
  spike: "bg-green-500/10 text-green-600 border-green-200",
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  drop: "bg-red-500/10 text-red-600 border-red-200",
  steady: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
}

const SIGNAL_LABELS: Record<string, string> = {
  spike: "Hot",
  new: "New",
  drop: "Drop",
  steady: "Steady",
}

// ─── Opportunity score (pro) ──────────────────────────────────────────────────

const OPPORTUNITY_TIPS = [
  "Add Framer to your profile — 43 open roles, low competition",
  "List Lovable or v0 to stand out: early specialists earn 20% more",
  "Highlight no-code projects — Webflow clients are hiring this week",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-green-500" />
  if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-red-500" />
  return <Minus className="w-4 h-4 text-muted-foreground" />
}

function DemandBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-6 text-right">{value}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

      {/* Stats row — all free */}
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

      {/* Row 2: Rising Products (free) + Hiring Insights (pro) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rising Products — free */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rising Products on Contra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_72px_auto] sm:grid-cols-[1fr_auto_72px_auto] gap-3 pb-2 border-b text-xs font-medium text-muted-foreground">
                <span>Product</span>
                <span className="hidden sm:block">Category</span>
                <span>Demand</span>
                <span />
              </div>
              {RISING_PRODUCTS.map((item) => {
                const Icon = CATEGORY_ICONS[item.category] ?? Layers
                return (
                  <div
                    key={item.name}
                    className="grid grid-cols-[1fr_72px_auto] sm:grid-cols-[1fr_auto_72px_auto] gap-3 items-center py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium truncate">{item.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0 hidden sm:inline-flex">
                      {item.category}
                    </Badge>
                    <DemandBar value={item.score} />
                    <TrendIcon trend={item.trend} />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hiring Insights — pro */}
        <FeatureGate requiredTier="pro">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Hiring Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 pb-2 border-b text-xs font-medium text-muted-foreground">
                  <span>Product</span>
                  <span>Open Roles</span>
                  <span>Avg. Rate</span>
                  <span>Competition</span>
                </div>
                {HIRING_INSIGHTS.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <TrendIcon trend={item.trend} />
                      <span className="text-sm font-medium truncate">{item.name}</span>
                      <span className="text-xs text-green-600 font-medium ml-1">{item.growth}</span>
                    </div>
                    <span className="text-sm tabular-nums font-medium">{item.openRoles}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">{item.avgRate}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs shrink-0 ${COMPETITION_COLOR[item.competition]}`}
                    >
                      {item.competition}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FeatureGate>
      </div>

      {/* Row 3: Market Signals (free) + Opportunity Score (pro) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Signals — free */}
        <Card>
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

        {/* Opportunity Score — pro */}
        <FeatureGate requiredTier="pro">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Your Opportunity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-primary">7.8</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Strong Match</p>
                  <p className="text-xs text-muted-foreground">
                    Your profile aligns with 12 active hiring opportunities on Contra right now.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recommended next steps
                </p>
                {OPPORTUNITY_TIPS.map((tip) => (
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
