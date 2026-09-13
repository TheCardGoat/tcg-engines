import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeLoseLife as impl } from "../asset-effects.ts";

export function proposeLoseLife(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "gain-life" | "lose-life" }>,
): FabEffectProposalResult {
  return impl(ctx, effect);
}
