import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseGigsToStealChoicePrompt } from "../../view/player-prompt.ts";
import { bestGigsToSteal } from "../util/gig-steal-plan.ts";

/**
 * Pick the Gig combination that best serves our visible card and color plan.
 * Rival Street Cred loss and die id settle otherwise equal choices.
 */
export const chooseGigsToStealResolver: ChoiceResolver<ChooseGigsToStealChoicePrompt> = (
  choice,
  ctx,
): MoveDecision => {
  const { count, eligibleDice } = choice.payload;
  if (eligibleDice.length < count) {
    return {
      kind: "stuck",
      reason: `chooseGigsToSteal: need ${count} dice but only ${eligibleDice.length} eligible`,
    };
  }
  const bestDieIds = bestGigsToSteal(ctx.view, ctx.playerId as string, eligibleDice, count);
  if (!bestDieIds || bestDieIds.length !== count) {
    return { kind: "stuck", reason: "chooseGigsToSteal: no eligible combination" };
  }
  return {
    kind: "command",
    move: "resolveStealGigs",
    args: { dieIds: bestDieIds },
  };
};
