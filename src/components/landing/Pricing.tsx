"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PLANS } from "@/lib/plans"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export function Pricing() {
  const { isSignedIn } = useUser()

  return (
    <section className="py-16 mt-12 mb-32 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-center text-muted-foreground mb-12">
          Choose the plan that fits your needs. Cancel anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(PLANS).map((plan) => (
            <Card
              key={plan.tier}
              className={`relative ${
                plan.highlighted ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                {plan.yearlyPrice > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ${plan.yearlyPrice}/year (2 months free)
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-primary mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={isSignedIn ? "/dashboard" : "/pricing"}>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.price === 0 ? "Get Started" : "Choose Plan"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
