import 'server-only';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redis } from '@/lib/redis/client';
import type { SubscriptionTier } from '@/types';

const CACHE_TTL = 300; // 5 minutes

export async function getUserSubscription(clerkId: string) {
  const cacheKey = `subscription:${clerkId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return cached as { tier: SubscriptionTier; status: string };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user[0]) {
    return { tier: 'free' as SubscriptionTier, status: 'inactive' };
  }

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(and(
      eq(subscriptions.userId, user[0].id),
      eq(subscriptions.status, 'active')
    ))
    .limit(1);

  const result = {
    tier: user[0].subscriptionTier as SubscriptionTier,
    status: subscription[0]?.status || 'inactive',
  };

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  return result;
}

export async function updateUserSubscriptionTier(
  userId: string,
  tier: SubscriptionTier
) {
  await db
    .update(users)
    .set({ subscriptionTier: tier, updatedAt: new Date() })
    .where(eq(users.id, userId));

  const user = await db
    .select({ clerkId: users.clerkId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user[0]) {
    await redis.del(`subscription:${user[0].clerkId}`);
  }
}
