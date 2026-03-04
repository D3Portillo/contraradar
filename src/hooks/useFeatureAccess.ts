import { useQuery } from '@tanstack/react-query';
import { useSubscription } from './useSubscription';

export function useFeatureAccess(featureKey: string) {
  const { tier, isPaid } = useSubscription();

  const { data: hasAccess, isLoading } = useQuery({
    queryKey: ['feature', featureKey, tier],
    queryFn: async () => {
      const res = await fetch(`/api/features/check?key=${featureKey}`);
      const data = await res.json();
      return data.hasAccess;
    },
    enabled: isPaid,
  });

  const simpleAccessCheck = () => {
    const proFeatures = ['advanced_analytics', 'priority_support', 'custom_domains', 'api_access'];
    const liteFeatures = ['limited_projects', 'basic_support'];

    if (proFeatures.includes(featureKey)) {
      return tier === 'pro';
    }

    if (liteFeatures.includes(featureKey)) {
      return tier === 'lite' || tier === 'pro';
    }

    return true;
  };

  return {
    hasAccess: isPaid ? hasAccess : simpleAccessCheck(),
    isLoading,
  };
}
