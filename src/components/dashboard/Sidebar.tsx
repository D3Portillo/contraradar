"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSubscription } from "@/hooks/useSubscription"
import { PlanBadge } from "@/components/shared/PlanBadge"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Billing", href: "/dashboard/billing" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { tier } = useSubscription()

  return (
    <div className="w-64 bg-card border-r min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">♢ RADAR</h2>
        <div className="mt-2">
          <PlanBadge tier={tier} />
        </div>
      </div>

      <nav>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
