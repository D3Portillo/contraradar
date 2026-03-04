"use client";

import { Button } from "@/components/ui/button";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function CTA() {
  const { isSignedIn } = useUser();

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of teams building better products with Contraradar.
        </p>
        {isSignedIn ? (
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <SignUpButton mode="modal">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
            </Button>
          </SignUpButton>
        )}
      </div>
    </section>
  );
}
