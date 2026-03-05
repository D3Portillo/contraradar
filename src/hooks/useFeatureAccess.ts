import { useSubscription } from './useSubscription';
import type { SubscriptionTier } from '@/types';

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  lite: 1,
  pro: 2,
};

export function useFeatureAccess(requiredTier: SubscriptionTier = 'free') {
  const { tier } = useSubscription();

  const hasAccess = TIER_RANK[tier] >= TIER_RANK[requiredTier];

  return {
    hasAccess,
    isLoading: false,
  };
}
