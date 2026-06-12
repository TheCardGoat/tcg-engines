import type { AutomatedActionCandidate, AutomatedActionPlanningContext } from "../../types";
import type { FamilyEvaluation, FamilyEvaluator } from "../internal-types";

type AlterHandCandidate = Extract<AutomatedActionCandidate, { family: "alterHand" }>;

export const evaluateAlterHand: FamilyEvaluator<AlterHandCandidate> = (
  context,
  candidate,
): FamilyEvaluation => {
  const hand = context.board.players[context.actorId]?.hand ?? [];
  const hasTwoInkable =
    hand.filter((cardId) => context.board.cards[String(cardId)]?.canBePutInInkwell === true)
      .length >= 2;
  const hasLowCostPlayable = hand.some(
    (cardId) => (context.board.cards[String(cardId)]?.playCost ?? Number.MAX_SAFE_INTEGER) <= 2,
  );
  const keepAllPreferred = hasTwoInkable && hasLowCostPlayable;
  const planOrder = keepAllPreferred
    ? { "keep-all": 0, "structural-mulligan": 1, "full-mulligan": 2 }
    : { "structural-mulligan": 0, "full-mulligan": 1, "keep-all": 2 };

  return {
    ranking: {
      keepAllPreferred,
      planOrder: planOrder[candidate.plan],
    },
  };
};

export function compareAlterHand(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
): number {
  return (left.planOrder ?? 0) - (right.planOrder ?? 0);
}
