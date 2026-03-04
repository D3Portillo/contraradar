"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { PlanBadge } from "@/components/shared/PlanBadge";

export default function BillingPage() {
  const { tier, status, isPaid } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer-portal");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
                </h3>
                <PlanBadge tier={tier} />
              </div>
              <p className="text-sm text-muted-foreground">
                Status: {status}
              </p>
            </div>
            <div className="text-right">
              {isPaid ? (
                <Button onClick={handleManageSubscription} disabled={loading}>
                  {loading ? "Loading..." : "Manage Subscription"}
                </Button>
              ) : (
                <Button>Upgrade Plan</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isPaid && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan -{" "}
                      {new Date(
                        Date.now() - i * 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Paid</p>
                  </div>
                  <p className="text-sm font-medium">
                    ${tier === "lite" ? "19.00" : "35.00"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your payment methods through the customer portal.
          </p>
          {isPaid && (
            <Button variant="outline" onClick={handleManageSubscription}>
              Update Payment Method
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
