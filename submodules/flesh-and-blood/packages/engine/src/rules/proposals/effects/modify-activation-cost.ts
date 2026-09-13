import type { FabEffect } from "@tcg/flesh-and-blood-types";

import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";

export function proposeModifyActivationCost(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { readonly type: "modify-activation-cost" }>,
): FabEffectProposalResult {
  return (
    proposeContinuousRuleEffect(ctx, effect) ??
    unsupported(effect, "activation-cost modifier could not be persisted")
  );
}
