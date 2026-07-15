import type { LorcanaProjectedCard } from "../../types";
import type { AutomatedActionCandidateHeuristic, AutomatedActionPlanningContext } from "../types";
import type { DetailedCandidateSummary, LoreRaceHeuristicPreferences } from "./internal-types";

export function compareNumbersAscending(left: number, right: number): number {
  return left - right;
}

export function compareNumbersDescending(left: number, right: number): number {
  return right - left;
}

export function compareBooleansDescending(left: boolean, right: boolean): number {
  if (left === right) {
    return 0;
  }

  return left ? -1 : 1;
}

export function createHeuristic(
  direction: AutomatedActionCandidateHeuristic["direction"],
  key: string,
  value: boolean | number | string,
): AutomatedActionCandidateHeuristic {
  return {
    direction,
    key,
    value,
  };
}

export function getProjectedCard(
  context: AutomatedActionPlanningContext,
  cardId: string,
): LorcanaProjectedCard | undefined {
  return context.board.cards[cardId];
}

export function getCardName(context: AutomatedActionPlanningContext, cardId: string): string {
  return getProjectedCard(context, cardId)?.fullName ?? cardId;
}

export function getPrintedLore(context: AutomatedActionPlanningContext, cardId: string): number {
  return getProjectedCard(context, cardId)?.lore ?? 0;
}

export function getPrintedCost(context: AutomatedActionPlanningContext, cardId: string): number {
  return getProjectedCard(context, cardId)?.playCost ?? 0;
}

export function resolveOpponentId(context: AutomatedActionPlanningContext): string | undefined {
  return context.board.playerOrder.find((playerId) => playerId !== context.actorId);
}

export function getPlayerLore(
  context: AutomatedActionPlanningContext,
  playerId: string | undefined,
): number {
  if (!playerId) {
    return 0;
  }

  return context.board.players[playerId]?.lore ?? 0;
}

export function getQuestPotentialForPlayer(
  context: AutomatedActionPlanningContext,
  playerId: string,
): number {
  const inPlay = context.board.players[playerId]?.play ?? [];

  return inPlay.reduce((total, cardId) => {
    const card = getProjectedCard(context, String(cardId));
    if (!card) {
      return total;
    }

    const lore = card.lore ?? 0;
    const canQuest =
      lore > 0 &&
      card.exerted !== true &&
      card.drying !== true &&
      card.hasQuestRestriction !== true;

    return canQuest ? total + lore : total;
  }, 0);
}

export function getQuestPotentialForPlayerExcluding(
  context: AutomatedActionPlanningContext,
  playerId: string,
  excludeCardId: string,
): number {
  const inPlay = context.board.players[playerId]?.play ?? [];

  return inPlay.reduce((total, cardId) => {
    if (String(cardId) === excludeCardId) {
      return total;
    }

    const card = getProjectedCard(context, String(cardId));
    if (!card) {
      return total;
    }

    const lore = card.lore ?? 0;
    const canQuest =
      lore > 0 &&
      card.exerted !== true &&
      card.drying !== true &&
      card.hasQuestRestriction !== true;

    return canQuest ? total + lore : total;
  }, 0);
}

export function canActorReachLoreGoalByQuesting(context: AutomatedActionPlanningContext): boolean {
  const actorLore = getPlayerLore(context, context.actorId);
  const questPotential = getQuestPotentialForPlayer(context, context.actorId);

  return actorLore + questPotential >= 20;
}

export function countCopiesInHand(
  context: AutomatedActionPlanningContext,
  actorId: string,
  cardId: string,
): number {
  const hand = context.board.players[actorId]?.hand ?? [];
  const targetCard = getProjectedCard(context, cardId);
  const targetKey = targetCard?.definitionId ?? targetCard?.fullName ?? cardId;

  return hand.reduce((count, currentCardId) => {
    const currentCard = getProjectedCard(context, String(currentCardId));
    const currentKey = currentCard?.definitionId ?? currentCard?.fullName ?? String(currentCardId);
    return currentKey === targetKey ? count + 1 : count;
  }, 0);
}

export function getAvailableInkForPlayer(
  context: AutomatedActionPlanningContext,
  playerId: string,
): number {
  const inkwell = context.board.players[playerId]?.inkwell ?? [];

  return inkwell.reduce((total, cardId) => {
    const card = getProjectedCard(context, String(cardId));
    return card?.exerted === true ? total : total + 1;
  }, 0);
}

export function isPermanentCardType(cardType: string | undefined): boolean {
  return cardType === "character" || cardType === "item" || cardType === "location";
}

export function getProjectedCardType(card: LorcanaProjectedCard | undefined): string | undefined {
  return (card as (LorcanaProjectedCard & { cardType?: string }) | undefined)?.cardType;
}

export function getFamilyOrder(
  candidateFamily: DetailedCandidateSummary["family"],
  prioritizeChallenge: boolean,
): number {
  const FAMILY_ORDER: Record<DetailedCandidateSummary["family"], number> = {
    chooseWhoGoesFirst: 0,
    alterHand: 1,
    resolveEffect: 2,
    resolveBag: 3,
    playCard: 4,
    quest: 4.5,
    putCardIntoInkwell: 5,
    activateAbility: 6,
    moveCharacterToLocation: 8,
    challenge: 9,
  };

  if (candidateFamily === "challenge" && prioritizeChallenge) {
    return FAMILY_ORDER.quest - 0.25;
  }

  return FAMILY_ORDER[candidateFamily];
}

export const LEGACY_LORE_RACE_HEURISTIC_PREFERENCES: LoreRaceHeuristicPreferences = {
  challengePriorityMode: "default",
  inkPrintedCostDirection: "desc",
  preferSimplePermanentDevelopment: false,
  playCardNetCostDirection: "asc",
};

export const DEFAULT_LORE_RACE_HEURISTIC_PREFERENCES: LoreRaceHeuristicPreferences = {
  challengePriorityMode: "default",
  inkPrintedCostDirection: "asc",
  preferSimplePermanentDevelopment: false,
  playCardNetCostDirection: "desc",
};

export const BOARD_CONTROL_LORE_RACE_HEURISTIC_PREFERENCES: LoreRaceHeuristicPreferences = {
  challengePriorityMode: "board-control",
  inkPrintedCostDirection: "asc",
  preferSimplePermanentDevelopment: true,
  playCardNetCostDirection: "desc",
};

export const AGGRESSIVE_BOARD_CONTROL_LORE_RACE_HEURISTIC_PREFERENCES: LoreRaceHeuristicPreferences =
  {
    challengePriorityMode: "aggressive-board-control",
    inkPrintedCostDirection: "asc",
    preferSimplePermanentDevelopment: true,
    playCardNetCostDirection: "desc",
  };
