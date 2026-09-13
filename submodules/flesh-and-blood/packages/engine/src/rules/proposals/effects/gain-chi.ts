import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeGainChi as impl } from "../asset-effects.ts";

export function proposeGainChi(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-action-points" | "gain-resources" | "gain-chi" }>,
): FabEffectProposalResult {
  return impl(ctx, effect);
}
