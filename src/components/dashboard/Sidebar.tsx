"use client"

import Link from "next/link"

import { useSubscription } from "@/hooks/useSubscription"
import { PlanBadge } from "@/components/shared/PlanBadge"
import { BrandLogo } from "./BrandLogo"
import { NavLinks } from "./NavLinks"

export function Sidebar() {
  const { tier } = useSubscription()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r min-h-screen p-4 shrink-0">
      <div className="mb-8 select-none">
        <BrandLogo />
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

      <NavLinks />
    </aside>
  )
}
