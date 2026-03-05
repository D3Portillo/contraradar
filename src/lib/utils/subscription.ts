import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redis } from '@/lib/redis/client';
import type { SubscriptionTier } from '@/types';

const CACHE_TTL = 300; // 5 minutes

export async function getUserSubscription(clerkId: string) {
  const cacheKey = `subscription:${clerkId}`;

  const cached = await redis.get(cacheKey);
  if (typeof cached === 'string') {
    return JSON.parse(cached) as { tier: SubscriptionTier; status: string };
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, subscription_tier')
    .eq('clerk_id', clerkId)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return { tier: 'free' as SubscriptionTier, status: 'inactive' };
  }

  const { data: subscription, error: subscriptionError } = await supabaseAdmin
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (subscriptionError) {
    throw subscriptionError;
  }

  const result = {
    tier: user.subscription_tier as SubscriptionTier,
    status: subscription?.status || 'inactive',
  };

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

  return result;
}

export async function updateUserSubscriptionTier(
  userId: string,
  tier: SubscriptionTier
) {
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ subscription_tier: tier, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (updateError) {
    throw updateError;
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('clerk_id')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  if (user?.clerk_id) {
    await redis.del(`subscription:${user.clerk_id}`);
  }
}
