"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { PlanBadge } from "@/components/shared/PlanBadge"
import { BrandLogo } from "./BrandLogo"
import { NavLinks } from "./NavLinks"
import { useSubscription } from "@/hooks/useSubscription"

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { tier } = useSubscription()

  return (
    <header className="h-16 border-b bg-card px-4 flex items-center gap-4">
      {/* Mobile: hamburger + branding — hidden on lg+ where Sidebar is visible */}
      <div className="flex items-center gap-2 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <MenuIcon className="w-5 h-5" />
        </Button>

        <BrandLogo />
      </div>

      {/* Push user button to the right */}
      <div className="ml-auto">
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Mobile navigation sheet */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent>
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          <div className="mb-8 select-none">
            <BrandLogo onClick={() => setMobileNavOpen(false)} />
            <div className="mt-2">
              <Link
                href="/dashboard/billing"
                title="Manage your billing plan"
                onClick={() => setMobileNavOpen(false)}
              >
                <PlanBadge tier={tier} />
              </Link>
            </div>
          </div>

          <NavLinks onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  )
}
