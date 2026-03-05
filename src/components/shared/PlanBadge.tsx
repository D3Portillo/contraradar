import { Badge } from "@/components/ui/badge";
import type { SubscriptionTier } from "@/types";

interface PlanBadgeProps {
  tier: SubscriptionTier;
}

const planColors: Record<SubscriptionTier, string> = {
  free: "bg-muted text-muted-foreground border-border",
  lite: "bg-secondary text-secondary-foreground",
  pro: "bg-primary text-primary-foreground",
};

const planLabels: Record<SubscriptionTier, string> = {
  free: "Free",
  lite: "Lite",
  pro: "Pro",
};

export function PlanBadge({ tier }: PlanBadgeProps) {
  return (
    <Badge className={planColors[tier]}>
      {planLabels[tier]}
    </Badge>
  );
}
