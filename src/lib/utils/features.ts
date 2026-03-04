import "server-only"
import { db } from "@/lib/db"
import { planFeatures } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { redis } from "@/lib/redis/client"
import type { SubscriptionTier } from "@/types"

const CACHE_TTL = 3600 // 1 hour

const PLAN_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  lite: 1,
  pro: 2,
}

export async function checkFeatureAccess(
  featureKey: string,
  userTier: SubscriptionTier,
): Promise<boolean> {
  const cacheKey = `feature:${featureKey}:${userTier}`

  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    return cached === "true"
  }

  const features = await db
    .select()
    .from(planFeatures)
    .where(eq(planFeatures.featureKey, featureKey))
    .limit(1)

  if (!features[0]) {
    return false
  }

  const hasAccess =
    PLAN_HIERARCHY[userTier] >=
    PLAN_HIERARCHY[features[0].plan as SubscriptionTier]

  await redis.setex(cacheKey, CACHE_TTL, hasAccess.toString())

  return hasAccess
}

export async function getFeaturesForPlan(plan: SubscriptionTier) {
  const cacheKey = `features:${plan}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return cached as string[]
  }

  const features = await db
    .select({ featureName: planFeatures.featureName })
    .from(planFeatures)
    .where(eq(planFeatures.plan, plan))

  const featureNames = features.map((f) => f.featureName)

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(featureNames))

  return featureNames
}
