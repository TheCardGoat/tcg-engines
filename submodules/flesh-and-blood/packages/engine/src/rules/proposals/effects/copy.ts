import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";

export function proposeCopy(
  ctx: ProposalContext,
  effect: FabEffect & { type: "copy" },
): FabEffectProposalResult {
  return (
    proposeContinuousRuleEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
