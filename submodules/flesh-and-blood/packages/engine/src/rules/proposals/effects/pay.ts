import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposePay as impl } from "../asset-effects.ts";

export function proposePay(
  ctx: ProposalContext,
  effect: FabEffect & { type: "pay" },
): FabEffectProposalResult {
  return impl(ctx, effect);
}
