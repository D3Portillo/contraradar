export type SubscriptionTier = 'free' | 'lite' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  name: string;
  tier: SubscriptionTier;
  price: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
}

export interface FeatureAccess {
  hasAccess: boolean;
  requiredPlan?: SubscriptionTier;
}
