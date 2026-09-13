import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";

export function proposeCanBeAttacked(
  ctx: ProposalContext,
  effect: FabEffect & { type: "can-be-attacked" },
): FabEffectProposalResult {
  return (
    proposeContinuousRuleEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
