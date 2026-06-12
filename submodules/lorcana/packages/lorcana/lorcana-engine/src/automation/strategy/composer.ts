import type {
  AutomatedActionCandidate,
  AutomatedActionCandidateSummary,
  AutomatedActionPlanningContext,
  AutomatedActionStrategy,
} from "../types";
import {
  compareNumbersAscending,
  createHeuristic,
  canActorReachLoreGoalByQuesting,
  getCardName,
  getFamilyOrder,
} from "./common";
import { compareActivateAbility, evaluateActivateAbility } from "./families/activate-ability";
import { compareAlterHand, evaluateAlterHand } from "./families/alter-hand";
import { compareChallenge, evaluateChallenge } from "./families/challenge";
import {
  compareChooseWhoGoesFirst,
  evaluateChooseWhoGoesFirst,
} from "./families/choose-who-goes-first";
import { comparePlayCard, evaluatePlayCard } from "./families/play-card";
import { comparePutInk, evaluatePutInk } from "./families/put-ink";
import { compareQuest, evaluateQuest } from "./families/quest";
import { compareResolution, evaluateResolution } from "./families/resolve";
import type {
  DetailedCandidateSummary,
  FamilyEvaluation,
  LoreRaceHeuristicPreferences,
} from "./internal-types";

function getStableKey(
  context: AutomatedActionPlanningContext,
  candidate: AutomatedActionCandidate,
): string {
  switch (candidate.family) {
    case "chooseWhoGoesFirst":
      return `chooseWhoGoesFirst:${candidate.firstPlayerId}`;
    case "alterHand":
      return `alterHand:${candidate.plan}:${candidate.cardsToMulligan.join(",")}`;
    case "resolveBag":
      return `resolveBag:${candidate.bagId}:${candidate.choiceIndex ?? ""}:${candidate.resolveOptional ?? ""}:${candidate.targets?.join(",") ?? ""}:${candidate.destinations?.map((destination) => `${destination.zone}:${destination.cards.join(",")}`).join("|") ?? ""}`;
    case "resolveEffect":
      return `resolveEffect:${candidate.effectId}:${candidate.choiceIndex ?? ""}:${candidate.resolveOptional ?? ""}:${candidate.targets?.join(",") ?? ""}:${candidate.destinations?.map((destination) => `${destination.zone}:${destination.cards.join(",")}`).join("|") ?? ""}`;
    case "putCardIntoInkwell":
      return `putCardIntoInkwell:${getCardName(context, candidate.cardId)}:${candidate.cardId}`;
    case "playCard":
      return `playCard:${getCardName(context, candidate.cardId)}:${candidate.cardId}:${typeof candidate.cost === "object" ? JSON.stringify(candidate.cost) : candidate.cost}:${candidate.choiceIndex ?? ""}:${candidate.resolveOptional ?? ""}:${candidate.targets?.join(",") ?? ""}`;
    case "activateAbility":
      return `activateAbility:${getCardName(context, candidate.cardId)}:${candidate.cardId}:${candidate.abilityIndex}:${candidate.choiceIndex ?? ""}:${candidate.targets?.join(",") ?? ""}`;
    case "quest":
      return `quest:${getCardName(context, candidate.cardId)}:${candidate.cardId}`;
    case "challenge":
      return `challenge:${getCardName(context, candidate.attackerId)}:${candidate.attackerId}:${getCardName(context, candidate.defenderId)}:${candidate.defenderId}`;
    case "moveCharacterToLocation":
      return `moveCharacterToLocation:${getCardName(context, candidate.characterId)}:${candidate.characterId}:${getCardName(context, candidate.locationId)}:${candidate.locationId}`;
  }
}

function evaluateFamily(
  context: AutomatedActionPlanningContext,
  candidate: AutomatedActionCandidate,
  preferences: LoreRaceHeuristicPreferences,
): FamilyEvaluation {
  switch (candidate.family) {
    case "chooseWhoGoesFirst":
      return evaluateChooseWhoGoesFirst(context, candidate, preferences);
    case "alterHand":
      return evaluateAlterHand(context, candidate, preferences);
    case "quest":
      return evaluateQuest(context, candidate, preferences);
    case "playCard":
      return evaluatePlayCard(context, candidate, preferences);
    case "activateAbility":
      return evaluateActivateAbility(context, candidate, preferences);
    case "putCardIntoInkwell":
      return evaluatePutInk(context, candidate, preferences);
    case "challenge":
      return evaluateChallenge(context, candidate, preferences);
    case "resolveBag":
    case "resolveEffect":
      return evaluateResolution(context, candidate, preferences);
    default:
      return { ranking: {} };
  }
}

function buildDetailedCandidateSummary(
  context: AutomatedActionPlanningContext,
  candidate: AutomatedActionCandidate,
  preferences: LoreRaceHeuristicPreferences,
): DetailedCandidateSummary {
  const stableKey = getStableKey(context, candidate);
  const familyEvaluation = evaluateFamily(context, candidate, preferences);
  const familyRanking = familyEvaluation.ranking;
  const familyOrder = getFamilyOrder(
    candidate.family,
    familyRanking.challengePriorityBoost === true,
  );
  const heuristics = [createHeuristic("asc", "familyOrder", familyOrder)];
  const ranking: DetailedCandidateSummary["ranking"] = {
    familyOrder,
    ...familyRanking,
  };

  if (candidate.family === "chooseWhoGoesFirst") {
    heuristics.push(createHeuristic("preferTrue", "selfFirst", ranking.selfFirst ?? false));
  }

  if (candidate.family === "alterHand") {
    heuristics.push(
      createHeuristic("preferTrue", "keepAllPreferred", ranking.keepAllPreferred ?? false),
    );
    heuristics.push(createHeuristic("asc", "planOrder", ranking.planOrder ?? 0));
  }

  if (candidate.family === "quest") {
    heuristics.push(createHeuristic("desc", "printedLore", ranking.printedLore ?? 0));
  }

  if (candidate.family === "playCard") {
    heuristics.push(
      createHeuristic(
        "preferTrue",
        "simpleDevelopmentPlay",
        ranking.simpleDevelopmentPlay ?? false,
      ),
    );
    heuristics.push(createHeuristic("asc", "playCardComplexity", ranking.playCardComplexity ?? 0));
    heuristics.push(
      createHeuristic(
        preferences.playCardNetCostDirection,
        "playCardNetCost",
        ranking.playCardNetCost ?? 0,
      ),
    );
    heuristics.push(createHeuristic("desc", "printedLore", ranking.printedLore ?? 0));
  }

  if (candidate.family === "activateAbility") {
    heuristics.push(createHeuristic("asc", "abilityComplexity", ranking.abilityComplexity ?? 0));
  }

  if (candidate.family === "resolveBag" || candidate.family === "resolveEffect") {
    heuristics.push(
      createHeuristic("desc", "resolveBenefitScore", ranking.resolveBenefitScore ?? 0),
    );
    heuristics.push(
      createHeuristic(
        "preferTrue",
        "resolveOptionalAccepted",
        ranking.resolveOptionalAccepted ?? false,
      ),
    );
    heuristics.push(createHeuristic("asc", "resolveComplexity", ranking.resolveComplexity ?? 0));
  }

  if (candidate.family === "putCardIntoInkwell") {
    heuristics.push(createHeuristic("preferTrue", "inkUnplayable", ranking.inkUnplayable ?? false));
    heuristics.push(createHeuristic("desc", "inkDuplicateCount", ranking.inkDuplicateCount ?? 0));
    heuristics.push(
      createHeuristic(
        preferences.inkPrintedCostDirection,
        "inkPrintedCost",
        ranking.inkPrintedCost ?? 0,
      ),
    );
    heuristics.push(createHeuristic("asc", "inkLore", ranking.inkLore ?? 0));
  }

  if (candidate.family === "challenge") {
    heuristics.push(
      createHeuristic(
        "preferTrue",
        "challengePriorityBoost",
        ranking.challengePriorityBoost ?? false,
      ),
    );
    heuristics.push(
      createHeuristic(
        "preferTrue",
        "challengeDefenderWouldBeBanished",
        ranking.challengeDefenderWouldBeBanished ?? false,
      ),
    );
    heuristics.push(
      createHeuristic(
        "preferTrue",
        "challengeAttackerSurvives",
        ranking.challengeAttackerSurvives ?? false,
      ),
    );
    if (preferences.challengePriorityMode === "aggressive-board-control") {
      heuristics.push(
        createHeuristic(
          "preferTrue",
          "challengeMeaningfulThreat",
          ranking.challengeMeaningfulThreat ?? false,
        ),
      );
      heuristics.push(
        createHeuristic("desc", "challengeTradeValueDelta", ranking.challengeTradeValueDelta ?? 0),
      );
    }
    heuristics.push(createHeuristic("desc", "challengeLoreSwing", ranking.challengeLoreSwing ?? 0));
    heuristics.push(
      createHeuristic("desc", "challengeDefenderLore", ranking.challengeDefenderLore ?? 0),
    );
    heuristics.push(
      createHeuristic("asc", "challengeAttackerLore", ranking.challengeAttackerLore ?? 0),
    );
  }

  heuristics.push(createHeuristic("asc", "stableKey", stableKey));

  return {
    candidate,
    family: candidate.family,
    heuristics: [...heuristics, ...(familyEvaluation.heuristics ?? [])],
    ranking,
    stableKey,
  };
}

function compareDetailedCandidateSummaries(
  left: DetailedCandidateSummary,
  right: DetailedCandidateSummary,
  preferences: LoreRaceHeuristicPreferences,
  context: AutomatedActionPlanningContext,
): number {
  if (
    canActorReachLoreGoalByQuesting(context) &&
    left.family !== right.family &&
    (left.family === "quest" || right.family === "quest")
  ) {
    return left.family === "quest" ? -1 : 1;
  }

  const familyOrder = compareNumbersAscending(left.ranking.familyOrder, right.ranking.familyOrder);
  if (familyOrder !== 0) {
    return familyOrder;
  }

  if (left.family === "chooseWhoGoesFirst" && right.family === "chooseWhoGoesFirst") {
    const selfFirst = compareChooseWhoGoesFirst(left.ranking, right.ranking);
    if (selfFirst !== 0) {
      return selfFirst;
    }
  }

  if (left.family === "alterHand" && right.family === "alterHand") {
    const planOrder = compareAlterHand(left.ranking, right.ranking);
    if (planOrder !== 0) {
      return planOrder;
    }
  }

  if (left.family === "quest" && right.family === "quest") {
    const loreOrder = compareQuest(left.ranking, right.ranking);
    if (loreOrder !== 0) {
      return loreOrder;
    }
  }

  if (left.family === "playCard" && right.family === "playCard") {
    const playCardOrder = comparePlayCard(left.ranking, right.ranking, preferences);
    if (playCardOrder !== 0) {
      return playCardOrder;
    }
  }

  if (left.family === "activateAbility" && right.family === "activateAbility") {
    const abilityOrder = compareActivateAbility(left.ranking, right.ranking);
    if (abilityOrder !== 0) {
      return abilityOrder;
    }
  }

  if (
    (left.family === "resolveBag" || left.family === "resolveEffect") &&
    left.family === right.family
  ) {
    const resolutionOrder = compareResolution(
      left.candidate,
      left.ranking,
      right.candidate,
      right.ranking,
    );
    if (resolutionOrder !== 0) {
      return resolutionOrder;
    }
  }

  if (left.family === "putCardIntoInkwell" && right.family === "putCardIntoInkwell") {
    const inkOrder = comparePutInk(left.ranking, right.ranking, preferences);
    if (inkOrder !== 0) {
      return inkOrder;
    }
  }

  if (left.family === "challenge" && right.family === "challenge") {
    const challengeOrder = compareChallenge(left.ranking, right.ranking, preferences);
    if (challengeOrder !== 0) {
      return challengeOrder;
    }
  }

  return left.stableKey.localeCompare(right.stableKey);
}

export function summarizeLoreRaceCandidates(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
  preferences: LoreRaceHeuristicPreferences,
): AutomatedActionCandidateSummary[] {
  return candidates
    .map((candidate) => buildDetailedCandidateSummary(context, candidate, preferences))
    .sort((left, right) => compareDetailedCandidateSummaries(left, right, preferences, context));
}

export function createLoreRaceAutomatedActionStrategy(
  name: string,
  summarize: (
    context: AutomatedActionPlanningContext,
    candidates: readonly AutomatedActionCandidate[],
  ) => AutomatedActionCandidateSummary[],
): AutomatedActionStrategy {
  return {
    name,
    summarizeCandidates(context, candidates) {
      return summarize(context, candidates);
    },
  };
}
