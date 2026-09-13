import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeCounterStatusEffect } from "../counter-status-effects.ts";

export function proposeTurnFaceDown(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "turn-face-down" | "turn-face-up" }>,
): FabEffectProposalResult {
  return (
    proposeCounterStatusEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
