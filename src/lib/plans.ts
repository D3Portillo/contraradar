import type { SubscriptionTier } from '@/types';

export const PLANS = {
  free: {
    name: 'Free',
    tier: 'free' as SubscriptionTier,
    price: 0,
    yearlyPrice: 0,
    features: ['Basic Dashboard', 'Limited Access'],
    highlighted: false,
  },
  lite: {
    name: 'Lite',
    tier: 'lite' as SubscriptionTier,
    price: 19,
    yearlyPrice: 190,
    features: [
      'Everything in Free',
      '5 Projects',
      'Basic Support',
      'Priority Updates',
    ],
    highlighted: false,
  },
  pro: {
    name: 'Pro',
    tier: 'pro' as SubscriptionTier,
    price: 35,
    yearlyPrice: 350,
    features: [
      'Everything in Lite',
      'Unlimited Projects',
      'Priority Support',
      'Advanced Analytics',
      'Custom Domains',
      'API Access',
    ],
    highlighted: true,
  },
};
