import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeGainLife as impl } from "../asset-effects.ts";

export function proposeGainLife(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-life" | "lose-life" }>,
): FabEffectProposalResult {
  return impl(ctx, effect);
}
