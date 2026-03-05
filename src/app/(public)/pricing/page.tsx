"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

const plans = [
  {
    name: "Free",
    tier: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["Basic Dashboard", "Limited Access"],
  },
  {
    name: "Lite",
    tier: "lite",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      "Everything in Free",
      "5 Projects",
      "Basic Support",
      "Priority Updates",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    tier: "pro",
    monthlyPrice: 35,
    yearlyPrice: 350,
    features: [
      "Everything in Lite",
      "Unlimited Projects",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domains",
      "API Access",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { isSignedIn } = useUser();
  const { redirectToSignIn } = useClerk();

  const handleCheckout = async (tier: "lite" | "pro") => {
    if (!isSignedIn) {
      redirectToSignIn();
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billingCycle }),
      });

      const data = await res.json();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-center mb-4">Pricing</h1>
          <p className="text-center text-muted-foreground mb-8">
            Choose the plan that fits your needs
          </p>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                Yearly (2 months free)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.tier}
                className={`relative ${
                  plan.highlighted ? "border-purple-500 shadow-lg" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      $
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : plan.yearlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-muted-foreground">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-green-500 mt-1">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.tier === "free" ? (
                    <Button className="w-full" variant="outline">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() =>
                        handleCheckout(plan.tier === "lite" ? "lite" : "pro")
                      }
                    >
                      Choose {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
