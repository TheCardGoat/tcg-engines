import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeLoseGame as impl } from "../asset-effects.ts";

export function proposeLoseGame(
  ctx: ProposalContext,
  effect: FabEffect & { type: "lose-game" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
