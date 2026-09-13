import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeCrowdCheers as impl } from "../asset-effects.ts";

export function proposeCrowdCheers(
  ctx: ProposalContext,
  effect: FabEffect & { type: "crowd-cheers" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
