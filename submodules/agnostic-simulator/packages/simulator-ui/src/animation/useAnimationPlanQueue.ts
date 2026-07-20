import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationPlanV1 } from "@tcg/protocol";
import type { AnimationPlaybackGate } from "@tcg/simulator-runtime/animation-playback";

export interface AnimationPlanQueueOptions {
  readonly incomingPlans?: readonly AnimationPlanV1[];
  readonly reset?: boolean;
  readonly gate?: AnimationPlaybackGate;
  readonly onPendingChange?: (pending: boolean) => void;
}

export interface AnimationPlanQueue {
  readonly plans: readonly AnimationPlanV1[];
  readonly hasPending: boolean;
  readonly enqueuePlans: (plans: readonly AnimationPlanV1[]) => void;
  readonly completePlan: (planId: string) => void;
  readonly clearPlans: () => void;
}

/** Shared deduplicating lifecycle for plan-driven simulator animation. */
export function useAnimationPlanQueue({
  incomingPlans = [],
  reset = false,
  gate,
  onPendingChange,
}: AnimationPlanQueueOptions = {}): AnimationPlanQueue {
  const [plans, setPlans] = useState<AnimationPlanV1[]>([]);
  const seenPlanIdsRef = useRef(new Set<string>());

  const enqueuePlans = useCallback(
    (nextPlans: readonly AnimationPlanV1[]) => {
      const additions = nextPlans.filter((plan) => !seenPlanIdsRef.current.has(plan.id));
      if (additions.length === 0) return;
      for (const plan of additions) seenPlanIdsRef.current.add(plan.id);
      gate?.begin(additions.map((plan) => plan.id));
      setPlans((current) => [...current, ...additions]);
    },
    [gate],
  );

  const clearPlans = useCallback(() => {
    seenPlanIdsRef.current.clear();
    gate?.clear();
    setPlans([]);
  }, [gate]);

  const completePlan = useCallback(
    (planId: string) => {
      gate?.complete(planId);
      setPlans((current) => current.filter((plan) => plan.id !== planId));
    },
    [gate],
  );

  useEffect(() => {
    if (reset) clearPlans();
  }, [clearPlans, reset]);

  useEffect(() => {
    if (!reset) enqueuePlans(incomingPlans);
  }, [enqueuePlans, incomingPlans, reset]);

  const hasPending = plans.length > 0;
  useEffect(() => onPendingChange?.(hasPending), [hasPending, onPendingChange]);
  useEffect(() => () => onPendingChange?.(false), [onPendingChange]);

  return { plans, hasPending, enqueuePlans, completePlan, clearPlans };
}
