"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan?: string;
  /** When provided, replaces the /pricing link with a demo unlock action. */
  onViewPlans?: () => void;
}

export function UpgradeModal({ isOpen, onClose, requiredPlan, onViewPlans }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Required</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            This feature requires a {requiredPlan || "paid"} plan. Upgrade now to unlock all features.
          </p>
          <div className="flex gap-2">
            {onViewPlans ? (
              <Button
                className="flex-1"
                onClick={onViewPlans}
                aria-label="Preview pro features without upgrading"
              >
                Preview Pro Features
              </Button>
            ) : (
              <Link href="/pricing">
                <Button className="flex-1">View Plans</Button>
              </Link>
            )}
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
