import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { conditionHolds } from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";
import { sharedConditionalBranchTarget } from "../../conditional-targets.ts";

export function proposeConditional(
  ctx: ProposalContext,
  effect: FabEffect & { type: "conditional" },
): FabEffectProposalResult {
  const branch = conditionHolds(ctx.state, ctx.layer, effect.condition) ? effect.then : effect.else;
  const sharedTarget = sharedConditionalBranchTarget(effect);
  return branch
    ? proposeEffect(
        {
          ...ctx,
          effectPath: [...ctx.effectPath, branch === effect.then ? 0 : 1],
          targetPath: sharedTarget
            ? `${ctx.targetPath}:then`
            : `${ctx.targetPath}:${branch === effect.then ? "then" : "else"}`,
        },
        branch,
      )
    : { supported: true, events: [] };
}
