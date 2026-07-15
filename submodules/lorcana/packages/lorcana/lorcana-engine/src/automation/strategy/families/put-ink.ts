import type { AutomatedActionCandidate, AutomatedActionPlanningContext } from "../../types";
import type {
  FamilyEvaluation,
  FamilyEvaluator,
  LoreRaceHeuristicPreferences,
} from "../internal-types";
import {
  countCopiesInHand,
  getAvailableInkForPlayer,
  getPrintedCost,
  getPrintedLore,
} from "../common";

type PutInkCandidate = Extract<AutomatedActionCandidate, { family: "putCardIntoInkwell" }>;

export const evaluatePutInk: FamilyEvaluator<PutInkCandidate> = (
  context,
  candidate,
): FamilyEvaluation => {
  const printedCost = getPrintedCost(context, candidate.cardId);
  const availableInk = getAvailableInkForPlayer(context, context.actorId);

  return {
    ranking: {
      inkDuplicateCount: countCopiesInHand(context, context.actorId, candidate.cardId),
      inkPrintedCost: printedCost,
      inkLore: getPrintedLore(context, candidate.cardId),
      inkUnplayable: printedCost > availableInk,
    },
  };
};

export function comparePutInk(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
  preferences: LoreRaceHeuristicPreferences,
): number {
  // Prefer inking cards that cannot be played with current ink
  if ((left.inkUnplayable ?? false) !== (right.inkUnplayable ?? false)) {
    return left.inkUnplayable ? -1 : 1;
  }

  const duplicateOrder = (right.inkDuplicateCount ?? 0) - (left.inkDuplicateCount ?? 0);
  if (duplicateOrder !== 0) {
    return duplicateOrder;
  }

  const costOrder =
    preferences.inkPrintedCostDirection === "desc"
      ? (right.inkPrintedCost ?? 0) - (left.inkPrintedCost ?? 0)
      : (left.inkPrintedCost ?? 0) - (right.inkPrintedCost ?? 0);
  if (costOrder !== 0) {
    return costOrder;
  }

  return (left.inkLore ?? 0) - (right.inkLore ?? 0);
}
