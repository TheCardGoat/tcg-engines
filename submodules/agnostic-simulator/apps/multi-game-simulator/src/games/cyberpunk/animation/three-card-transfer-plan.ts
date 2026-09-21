import type { AnimationPlanV2 } from "@tcg/protocol";

const DEFAULT_CARD_TRANSFER_DURATION_MS = 567;

export function enhanceCyberpunkCardTransferTiming(
  plan: AnimationPlanV2,
  enabled: boolean,
): AnimationPlanV2 {
  if (!enabled) return plan;
  return {
    ...plan,
    steps: plan.steps.map((step) =>
      step.type === "entityTransfer"
        ? {
            ...step,
            durationMs: Math.max(step.durationMs ?? 0, DEFAULT_CARD_TRANSFER_DURATION_MS),
          }
        : step,
    ),
  };
}
