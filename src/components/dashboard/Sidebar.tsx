"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useSubscription } from "@/hooks/useSubscription"
import { PlanBadge } from "@/components/shared/PlanBadge"

import asset_icon from "@/assets/icon.svg"
import Image from "next/image"

const NAVIGATION = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Billing", href: "/dashboard/billing" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { tier } = useSubscription()

  return (
    <div className="w-64 bg-card border-r min-h-screen p-4">
      <div className="mb-8 select-none">
        <nav className="flex gap-1 items-center">
          <Link title="Go to main page" href="/" className="w-6">
            <Image alt="" src={asset_icon} />
          </Link>

          <h2 className="text-xl font-bold">RADAR</h2>
        </nav>
        <div className="mt-2">
          <Link
            href="/dashboard/billing"
            className="cursor-pointer"
            title="Manage your billing plan"
          >
            <PlanBadge tier={tier} />
          </Link>
        </div>
      </div>

      <nav className="-mx-4">
        {NAVIGATION.map((item) => (
          <Link
            key={`nav-item-${item.href}`}
            href={item.href}
            className={cn(
              "block px-4 py-3 rounded-md text-sm font-medium transition-colors",
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
