"use client"

import { SignUpButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import ShapeBlur from "@/components/ShapeBlur"

export function Hero() {
  const { isSignedIn } = useUser()

  return (
    <section className="mt-56 px-4">
      <figure className="absolute top-0 left-0 right-0 h-screen pointer-events-none opacity-35">
        <ShapeBlur color="red" variation={3} circleSize={0.5} circleEdge={1} />
      </figure>

      <div className="container relative z-1 mx-auto text-center max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-foreground">
          Market intelligence for Contra Experts
        </h1>

        <p className="text-xl text-zinc-800 mb-12">
          Get hired by learning in-demand skills
        </p>

        <div className="flex gap-4 justify-center">
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                View Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </SignUpButton>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
