import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeCounterStatusEffect } from "../counter-status-effects.ts";

export function proposeTap(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "tap" | "untap" }>,
): FabEffectProposalResult {
  return (
    proposeCounterStatusEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
