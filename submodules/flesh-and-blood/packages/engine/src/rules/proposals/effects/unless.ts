import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";

export function proposeUnless(
  ctx: ProposalContext,
  effect: FabEffect & { type: "unless" },
): FabEffectProposalResult {
  // Boolean at effectPath: true = pay escape (skip principal); false/absent =
  // run principal. findDecision opens the optional for the escape payer when
  // the cost is affordable (Coronet Peak / "unless they pay" family).
  const choice = ctx.effectChoices[ctx.effectPath.join(".")];
  if (choice === true) {
    return proposeEffect(
      {
        ...ctx,
        effectPath: [...ctx.effectPath, 1],
        targetPath: `${ctx.targetPath}:unless-escape`,
      },
      effect.escape,
    );
  }
  return proposeEffect(
    { ...ctx, effectPath: [...ctx.effectPath, 0], targetPath: `${ctx.targetPath}:unless` },
    effect.effect,
  );
}
