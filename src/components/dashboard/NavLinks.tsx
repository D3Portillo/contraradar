"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export const NAVIGATION = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Billing", href: "/dashboard/billing" },
]

interface NavLinksProps {
  onNavigate?: () => void
}

export function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className="-mx-4">
      {NAVIGATION.map((item) => (
        <Link
          key={`nav-item-${item.href}`}
          href={item.href}
          onClick={onNavigate}
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
  )
}
