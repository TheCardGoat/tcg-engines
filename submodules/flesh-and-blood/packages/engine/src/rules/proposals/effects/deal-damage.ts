import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeDealDamage as impl } from "../asset-effects.ts";

export function proposeDealDamage(
  ctx: ProposalContext,
  effect: FabEffect & { type: "deal-damage" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
