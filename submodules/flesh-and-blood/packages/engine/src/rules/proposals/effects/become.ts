import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";
import { proposeMechanicEffect } from "../mechanic-effects.ts";

export function proposeBecome(
  ctx: ProposalContext,
  effect: FabEffect & { type: "become" },
): FabEffectProposalResult {
  return (
    proposeContinuousRuleEffect(ctx, effect) ??
    proposeMechanicEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
