import { useUser as useClerkUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return null;
      const res = await fetch('/api/subscription');
      return res.json();
    },
    enabled: isLoaded && isSignedIn,
  });

  return {
    user,
    isLoaded,
    isSignedIn,
    subscription,
  };
}
