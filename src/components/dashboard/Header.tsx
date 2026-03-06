"use client"

import { UserButton } from "@clerk/nextjs"

export function Header() {
  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div />
      <UserButton afterSignOutUrl="/" />
    </header>
  )
}
