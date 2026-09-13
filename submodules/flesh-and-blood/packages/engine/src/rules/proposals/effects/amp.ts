import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeAmp as impl } from "../asset-effects.ts";

export function proposeAmp(
  ctx: ProposalContext,
  effect: FabEffect & { type: "amp" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
