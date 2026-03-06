"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignUpButton, useUser } from "@clerk/nextjs"

export function Hero() {
  const { isSignedIn } = useUser()

  return (
    <section className="mt-56 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Radar — market intelligence for Contra experts.
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Professional tools for modern teams. Simple pricing, powerful
          features.
        </p>
        <div className="flex gap-4 justify-center">
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                </Button>
              </SignUpButton>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
