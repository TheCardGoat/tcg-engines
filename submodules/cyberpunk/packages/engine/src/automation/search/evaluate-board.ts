import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import { gigPlanValue } from "../util/gig-plan.ts";
import { evaluateLateGigRace, isLateGigRace } from "./gig-race.ts";
import {
  canAttackRivalThisTurn,
  canAttackThisTurn,
  hasCardRule,
  isReadyBlocker,
} from "../util/attack-readiness.ts";

export interface BoardFeatures {
  gigRace: number;
  streetCred: number;
  fieldMaterial: number;
  readyPower: number;
  blockerCoverage: number;
  attackPressure: number;
  handSize: number;
  availableEddies: number;
  deckSafety: number;
  gigSetup: number;
}

export interface BoardEvaluationWeights {
  gigRace: number;
  streetCred: number;
  fieldMaterial: number;
  readyPower: number;
  blockerCoverage: number;
  attackPressure: number;
  handSize: number;
  availableEddies: number;
  deckSafety: number;
  gigSetup: number;
}

export const DEFAULT_BOARD_EVALUATION_WEIGHTS: BoardEvaluationWeights = {
  gigRace: 120,
  streetCred: 1,
  fieldMaterial: 6,
  readyPower: 3,
  blockerCoverage: 18,
  attackPressure: 16,
  handSize: 8,
  availableEddies: 6,
  deckSafety: 2,
  gigSetup: 1,
};

const TERMINAL_SCORE = 1_000_000;

export function evaluateBoard(
  view: FilteredMatchView,
  playerId: string,
  weights: BoardEvaluationWeights = DEFAULT_BOARD_EVALUATION_WEIGHTS,
): number {
  if (view.gameEnded) {
    if (view.winnerId === playerId) return TERMINAL_SCORE;
    if (view.winnerId) return -TERMINAL_SCORE;
    return 0;
  }

  const own = extractBoardFeatures(view, playerId);
  const rivalIds = Object.keys(view.players).filter((id) => id !== playerId);
  if (rivalIds.length === 0) return scoreFeatures(own, weights);
  const late = isLateGigRace(view);
  const positionalWeights = late ? { ...weights, gigRace: 0 } : weights;
  return (
    evaluateLateGigRace(view, playerId) +
    Math.min(
      ...rivalIds.map((rivalId) =>
        scoreFeatureDelta(own, extractBoardFeatures(view, rivalId), positionalWeights),
      ),
    )
  );
}

export function extractBoardFeatures(view: FilteredMatchView, playerId: string): BoardFeatures {
  const player = view.players[playerId];
  if (!player) return emptyFeatures();
  const field = zoneCards(player.zones.field);
  const legends = zoneCards(player.zones.legendArea).filter((card) => !card.faceDown);
  const hasPlayedProgramThisTurn =
    view.playedCardTypesThisTurn[playerId]?.includes("program") === true;
  const readyUnits = field.filter((card) => canAttackThisTurn(card, hasPlayedProgramThisTurn));
  const directAttackers = field.filter((card) =>
    canAttackRivalThisTurn(card, hasPlayedProgramThisTurn),
  );
  const blockers = field.filter(isReadyBlocker);
  const gigCount = player.gigCount;

  return {
    gigRace: gigRaceValue(gigCount),
    streetCred: player.streetCred,
    fieldMaterial:
      field.reduce((total, card) => total + cardMaterialValue(card), 0) +
      legends.reduce((total, card) => total + cardMaterialValue(card) * 0.5, 0),
    readyPower: readyUnits.reduce((total, card) => total + Math.max(0, card.effectivePower), 0),
    blockerCoverage: blockers.reduce(
      (total, card) => total + 1 + Math.max(0, card.effectivePower) / 10,
      0,
    ),
    attackPressure: directAttackers.reduce(
      (total, card) => total + directStealPotential(card.effectivePower),
      0,
    ),
    handSize: zoneCount(player.zones.hand),
    availableEddies: player.availableEddies,
    deckSafety: Math.min(10, zoneCount(player.zones.deck)),
    gigSetup: gigPlanValue(view, playerId),
  };
}

function scoreFeatureDelta(
  own: BoardFeatures,
  rival: BoardFeatures,
  weights: BoardEvaluationWeights,
): number {
  return (Object.keys(weights) as Array<keyof BoardEvaluationWeights>).reduce(
    (score, key) => score + (own[key] - rival[key]) * weights[key],
    0,
  );
}

function scoreFeatures(features: BoardFeatures, weights: BoardEvaluationWeights): number {
  return (Object.keys(weights) as Array<keyof BoardEvaluationWeights>).reduce(
    (score, key) => score + features[key] * weights[key],
    0,
  );
}

function gigRaceValue(gigCount: number): number {
  const clamped = Math.max(0, Math.min(7, gigCount));
  const pressure = clamped >= 6 ? 8 : clamped >= 5 ? 4 : clamped >= 4 ? 2 : 0;
  return clamped + pressure;
}

function cardMaterialValue(card: FilteredCardView): number {
  const power = Math.max(0, card.effectivePower);
  const printedCost = Math.max(0, card.cost ?? 0);
  const attachedGear = card.attachedGearIds.length * 2;
  const blocker = hasCardRule(card, "blocker") ? 3 : 0;
  const immediateAttack =
    card.keywords.includes("adrenaline") || card.keywords.includes("goSolo") ? 2 : 0;
  const triggers = Math.min(3, card.triggerHints.length);
  return power + printedCost * 1.5 + attachedGear + blocker + immediateAttack + triggers;
}

function directStealPotential(power: number): number {
  if (power <= 0) return 0;
  return 1 + Math.floor(power / 10);
}

function zoneCards(zone: FilteredCardView[] | number | undefined): FilteredCardView[] {
  return Array.isArray(zone) ? zone : [];
}

function zoneCount(zone: FilteredCardView[] | number | undefined): number {
  return Array.isArray(zone) ? zone.length : (zone ?? 0);
}

function emptyFeatures(): BoardFeatures {
  return {
    gigRace: 0,
    streetCred: 0,
    fieldMaterial: 0,
    readyPower: 0,
    blockerCoverage: 0,
    attackPressure: 0,
    handSize: 0,
    availableEddies: 0,
    deckSafety: 0,
    gigSetup: 0,
  };
}
