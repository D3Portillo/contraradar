import { useUser as useClerkUser } from "@clerk/nextjs"
import type { SubscriptionTier } from "@/types"

type SubscriptionState = {
  tier: SubscriptionTier
  status: "active" | "inactive"
}

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser()

  const metadata = user?.publicMetadata as {
    subscriptionTier?: string
    subscriptionStatus?: string
  }

  const tier = metadata?.subscriptionTier
  const status = metadata?.subscriptionStatus

  const subscription: SubscriptionState | null = user
    ? {
        tier: tier === "lite" || tier === "pro" ? tier : "free",
        status: status === "active" ? "active" : "inactive",
      }
    : null

  return {
    user,
    isLoaded,
    isSignedIn,
    subscription,
  }
}
