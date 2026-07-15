import type { AutomatedActionCandidate, AutomatedActionPlanningContext } from "../../types";
import type {
  FamilyEvaluation,
  FamilyEvaluator,
  LoreRaceHeuristicPreferences,
} from "../internal-types";
import {
  getAvailableInkForPlayer,
  getPrintedCost,
  getPrintedLore,
  getProjectedCard,
  getProjectedCardType,
  isPermanentCardType,
} from "../common";

type PlayCardCandidate = Extract<AutomatedActionCandidate, { family: "playCard" }>;

export function getPlayCardComplexity(candidate: PlayCardCandidate): number {
  let complexity = 0;

  if (typeof candidate.choiceIndex === "number") {
    complexity += 1;
  }
  if (typeof candidate.resolveOptional === "boolean") {
    complexity += 1;
  }
  complexity += candidate.targets?.length ?? 0;

  if (typeof candidate.cost === "object") {
    if (candidate.cost.cost === "shift" || candidate.cost.cost === "sing") {
      complexity += 1;
    }
    if (candidate.cost.cost === "singTogether") {
      complexity += candidate.cost.singers.length;
    }
  }

  return complexity;
}

export function getPlayCardNetCost(
  context: AutomatedActionPlanningContext,
  candidate: PlayCardCandidate,
): number {
  if (candidate.cost === "free") {
    return 0;
  }

  if (candidate.cost === "standard") {
    return getPrintedCost(context, candidate.cardId);
  }

  if (typeof candidate.cost === "object") {
    switch (candidate.cost.cost) {
      case "free":
      case "sing":
      case "singTogether":
        return 0;
      case "standard":
      case "shift":
        return getPrintedCost(context, candidate.cardId);
    }
  }

  return getPrintedCost(context, candidate.cardId);
}

function isSimpleDevelopmentPlay(
  context: AutomatedActionPlanningContext,
  candidate: PlayCardCandidate,
): boolean {
  const card = getProjectedCard(context, candidate.cardId);
  if (!isPermanentCardType(getProjectedCardType(card))) {
    return false;
  }

  const netCost = getPlayCardNetCost(context, candidate);
  if (netCost <= 0 || netCost > getAvailableInkForPlayer(context, context.actorId)) {
    return false;
  }

  return getPlayCardComplexity(candidate) === 0;
}

export const evaluatePlayCard: FamilyEvaluator<PlayCardCandidate> = (
  context,
  candidate,
  preferences,
): FamilyEvaluation => ({
  ranking: {
    playCardComplexity: getPlayCardComplexity(candidate),
    playCardNetCost: getPlayCardNetCost(context, candidate),
    printedLore: getPrintedLore(context, candidate.cardId),
    simpleDevelopmentPlay:
      preferences.preferSimplePermanentDevelopment && isSimpleDevelopmentPlay(context, candidate),
  },
});

export function comparePlayCard(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
  preferences: LoreRaceHeuristicPreferences,
): number {
  if (preferences.preferSimplePermanentDevelopment) {
    if ((left.simpleDevelopmentPlay ?? false) !== (right.simpleDevelopmentPlay ?? false)) {
      return left.simpleDevelopmentPlay ? -1 : 1;
    }
  }

  const complexityOrder = (left.playCardComplexity ?? 0) - (right.playCardComplexity ?? 0);
  if (complexityOrder !== 0) {
    return complexityOrder;
  }

  const netCostOrder =
    preferences.playCardNetCostDirection === "asc"
      ? (left.playCardNetCost ?? 0) - (right.playCardNetCost ?? 0)
      : (right.playCardNetCost ?? 0) - (left.playCardNetCost ?? 0);
  if (netCostOrder !== 0) {
    return netCostOrder;
  }

  return (right.printedLore ?? 0) - (left.printedLore ?? 0);
}
