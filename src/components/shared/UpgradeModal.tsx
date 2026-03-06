"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import type { SubscriptionTier } from "@/types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The tier the user currently holds — used to filter which plans to show. Defaults to "free". */
  currentTier?: SubscriptionTier;
  /** Optional heading shown above the plan cards. */
  title?: string;
  /** Optional subheading text. */
  description?: string;
}

const UPGRADE_PLANS = [PLANS.lite, PLANS.pro] as const;

export function UpgradeModal({
  isOpen,
  onClose,
  currentTier = "free",
  title = "Upgrade your plan",
  description = "Unlock more features by upgrading to a paid plan.",
}: UpgradeModalProps) {
  const router = useRouter();

  const handleSelect = (tier: SubscriptionTier) => {
    onClose();
    router.push(`/dashboard/billing?upgrade=${tier}`);
  };

  /** Only show plans that are above the user's current tier */
  const visiblePlans = UPGRADE_PLANS.filter((plan) => {
    if (currentTier === "free") return true;
    if (currentTier === "lite") return plan.tier === "pro";
    return false;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "grid gap-4 py-2",
            visiblePlans.length > 1 ? "sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {visiblePlans.map((plan) => (
            <div
              key={plan.tier}
              className={cn(
                "flex flex-col border p-4 gap-3",
                plan.highlighted ? "border-primary" : "border-border",
              )}
            >
              {plan.highlighted && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-2xl font-bold mt-1">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>

              <ul className="flex flex-col gap-1 text-sm text-muted-foreground grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-2"
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => handleSelect(plan.tier)}
              >
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
