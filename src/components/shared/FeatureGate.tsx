"use client";

import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "./UpgradeModal";
import { useState } from "react";
import type { SubscriptionTier } from "@/types";

interface FeatureGateProps {
  requiredTier?: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ requiredTier = "lite", children, fallback }: FeatureGateProps) {
  const { hasAccess } = useFeatureAccess(requiredTier);
  const { tier } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div
        className="relative cursor-pointer"
        onClick={() => setShowUpgrade(true)}
      >
        <div className="opacity-50 blur-sm pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <button
            onClick={() => setShowUpgrade(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Upgrade to Unlock
          </button>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier={tier}
      />
    </>
  );
}
