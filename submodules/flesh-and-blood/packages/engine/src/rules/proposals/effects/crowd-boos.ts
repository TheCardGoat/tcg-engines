import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeCrowdBoos as impl } from "../asset-effects.ts";

export function proposeCrowdBoos(
  ctx: ProposalContext,
  effect: FabEffect & { type: "crowd-boos" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
