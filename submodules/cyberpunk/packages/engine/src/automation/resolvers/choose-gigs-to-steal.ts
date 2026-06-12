import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseGigsToStealChoicePrompt } from "../../view/player-prompt.ts";

/**
 * Default chooseGigsToSteal resolver. Picks the highest-face dice first to
 * maximize the Street Cred swing — every die counts as one Gig regardless of
 * face, but stealing a high-face die hurts the rival's Street Cred more and
 * boosts ours. Ties broken by die id for determinism.
 */
export const chooseGigsToStealResolver: ChoiceResolver<ChooseGigsToStealChoicePrompt> = (
  choice,
): MoveDecision => {
  const { count, eligibleDice } = choice.payload;
  if (eligibleDice.length < count) {
    return {
      kind: "stuck",
      reason: `chooseGigsToSteal: need ${count} dice but only ${eligibleDice.length} eligible`,
    };
  }
  const sorted = [...eligibleDice].sort((a, b) => {
    if (a.faceValue !== b.faceValue) return b.faceValue - a.faceValue;
    return a.dieId.localeCompare(b.dieId);
  });
  const dieIds = sorted.slice(0, count).map((d) => d.dieId);
  return {
    kind: "command",
    move: "resolveStealGigs",
    args: { dieIds },
  };
};
