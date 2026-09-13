import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeRoll as impl } from "../asset-effects.ts";

export function proposeRoll(
  ctx: ProposalContext,
  effect: FabEffect & { type: "roll" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
