import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart2,
  TrendingUp,
  Crosshair,
  Users,
  Zap,
  Search,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const features: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Skill Demand Trends",
    description:
      "Discover which skills are driving the most projects and revenue on Contra right now.",
    Icon: BarChart2,
  },
  {
    title: "Rate Benchmarks",
    description:
      "See what top-performing experts charge and calibrate your rates to win more clients.",
    Icon: TrendingUp,
  },
  {
    title: "Niche Discovery",
    description:
      "Identify underserved niches with high client demand and low expert competition.",
    Icon: Crosshair,
  },
  {
    title: "Expert Rankings",
    description:
      "Track which experts are landing the most contracts and learn what sets them apart.",
    Icon: Users,
  },
  {
    title: "Opportunity Alerts",
    description:
      "Get notified the moment demand spikes for your skills or services on Contra.",
    Icon: Zap,
  },
  {
    title: "Client Intent",
    description:
      "Understand exactly what clients are searching for before you write your next pitch.",
    Icon: Search,
  },
]

export function Features() {
  return (
    <section className="py-16 border-t mt-44 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl uppercase font-bold text-center mb-12">
          Built for Contra Experts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, description, Icon }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
