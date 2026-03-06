"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

import asset_logo from "@/assets/logo.svg"
import Image from "next/image"

export function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="w-32">
          <Image className="w-full" alt="" src={asset_logo} />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="hidden sm:inline text-sm hover:underline"
          >
            Pricing
          </Link>

          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm hover:underline">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
