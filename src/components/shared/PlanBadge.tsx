import { Badge } from "@/components/ui/badge";
import type { SubscriptionTier } from "@/types";

interface PlanBadgeProps {
  tier: SubscriptionTier;
}

const planColors: Record<SubscriptionTier, string> = {
  free: "bg-gray-500",
  lite: "bg-blue-500",
  pro: "bg-purple-500",
};

const planLabels: Record<SubscriptionTier, string> = {
  free: "Free",
  lite: "Lite",
  pro: "Pro",
};

export function PlanBadge({ tier }: PlanBadgeProps) {
  return (
    <Badge className={`${planColors[tier]} text-white`}>
      {planLabels[tier]}
    </Badge>
  );
}
