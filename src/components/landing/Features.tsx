import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Powerful Dashboard",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: "📊",
  },
  {
    title: "Team Collaboration",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: "👥",
  },
  {
    title: "Advanced Analytics",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: "📈",
  },
  {
    title: "API Access",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: "🔌",
  },
  {
    title: "Custom Domains",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: "🌐",
  },
  {
    title: "Priority Support",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: "💬",
  },
]

export function Features() {
  return (
    <section className="py-16 border-t mt-44 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl uppercase font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
