import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeGainActionPoints as impl } from "../asset-effects.ts";

export function proposeGainActionPoints(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-action-points" | "gain-resources" | "gain-chi" }>,
): FabEffectProposalResult {
  return impl(ctx, effect);
}
