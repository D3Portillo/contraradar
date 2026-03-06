import { useUser } from "./useUser"
import type { SubscriptionTier } from "@/types"

export function useSubscription() {
  const { subscription, isSignedIn } = useUser()

  const tier = (subscription?.tier || "free") as SubscriptionTier

  const isFree = tier === "free"
  const isLite = tier === "lite"
  const isPro = tier === "pro"
  const isPaid = isLite || isPro

  const status = isFree ? "active" : subscription?.status || "inactive"

  return {
    tier,
    status,
    isFree,
    isLite,
    isPro,
    isPaid,
    isSignedIn,
  }
}
