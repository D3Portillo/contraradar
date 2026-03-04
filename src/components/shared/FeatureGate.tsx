"use client";

import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { UpgradeModal } from "./UpgradeModal";
import { useState } from "react";

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ featureKey, children, fallback }: FeatureGateProps) {
  const { hasAccess } = useFeatureAccess(featureKey);
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
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
          >
            Upgrade to Unlock
          </button>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        requiredPlan={featureKey.includes("pro") ? "Pro" : "Lite"}
      />
    </>
  );
}
