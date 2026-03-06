"use client"

import { useSubscription } from "@/hooks/useSubscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureGate } from "@/components/shared/FeatureGate"
import { useUser } from "@/hooks/useUser"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back {user?.firstName ? user.firstName : "to your dashboard"}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
          </CardContent>
        </Card>

        <FeatureGate requiredTier="pro">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
            </CardContent>
          </Card>
        </FeatureGate>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Lorem ipsum dolor sit amet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i} hour{i > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <FeatureGate requiredTier="pro">
          <Card>
            <CardHeader>
              <CardTitle>Priority Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get priority access to our support team.
              </p>
              <button className="text-sm text-primary font-medium">
                Contact Support →
              </button>
            </CardContent>
          </Card>
        </FeatureGate>
      </div>
    </div>
  )
}
