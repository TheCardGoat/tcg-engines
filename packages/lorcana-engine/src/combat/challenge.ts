/**
 * Challenge Action (Rule 4.3.6)
 *
 * Challenge logic:
 * - Challenger must be ready and dry
 * - Target character must be exerted (unless Evasive)
 * - Must challenge Bodyguard first (unless Evasive)
 * - Locations can be challenged anytime
 * - Both characters deal damage simultaneously
 */

import {
  getStrength,
  getWillpower,
  hasBodyguard,
  hasEvasive,
  isCharacter,
  isLocation,
} from "../card-utils";
import type { MoveValidationResult } from "../moves/move-types";
import { invalidMove, validMove } from "../moves/move-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import { getTotalKeywordValue } from "../types/keywords";
import type { CardInstanceState } from "../zones/card-state";
import type { DamageCalculation, DamageModifier } from "./combat-types";

/**
 * Validate challenge action
 */
export function validateChallenge(
  challengerCard: LorcanaCardDefinition | undefined,
  challengerState: CardInstanceState | undefined,
  challengerOwner: PlayerId,
  targetCard: LorcanaCardDefinition | undefined,
  targetState: CardInstanceState | undefined,
  targetOwner: PlayerId,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
  readyBodyguards: CardId[], // Ready bodyguards on opponent's side
): MoveValidationResult {
  const errors = [];

  // Must be active player's turn
  if (challengerOwner !== activePlayerId) {
    errors.push({ type: "NOT_YOUR_CHARACTER" as const });
  }

  if (!isMainPhase) {
    errors.push({ type: "NOT_MAIN_PHASE" as const });
  }

  // Challenger must exist
  if (!(challengerCard && challengerState)) {
    errors.push({ type: "NOT_IN_PLAY" as const });
    return invalidMove(...errors);
  }

  // Challenger must be a character
  if (!isCharacter(challengerCard)) {
    errors.push({ type: "NOT_A_CHARACTER" as const });
  }

  // Challenger must be ready (Rule 4.3.6.4)
  if (challengerState.state === "exerted") {
    errors.push({ type: "NOT_READY" as const });
  }

  // Challenger must be dry (Rule 4.3.6.5)
  if (challengerState.isDrying) {
    errors.push({ type: "NOT_DRY" as const });
  }

  // Target must exist
  if (!targetCard) {
    errors.push({ type: "INVALID_TARGET" as const });
    return invalidMove(...errors);
  }

  if (!targetState) {
    errors.push({ type: "TARGET_NOT_IN_PLAY" as const });
    return invalidMove(...errors);
  }

  // Cannot challenge own cards
  if (targetOwner === activePlayerId) {
    errors.push({ type: "CANNOT_CHALLENGE_OWN" as const });
  }

  // Target validation depends on type
  if (isCharacter(targetCard)) {
    // Characters must be exerted to be challenged (unless attacker has Evasive)
    const attackerHasEvasive = hasEvasive(challengerCard);

    if (!attackerHasEvasive && targetState.state !== "exerted") {
      errors.push({ type: "TARGET_NOT_EXERTED" as const });
    }

    // Must challenge Bodyguard first (unless attacker has Evasive)
    if (!attackerHasEvasive && readyBodyguards.length > 0) {
      const targetId = targetCard.id as CardId;
      if (!readyBodyguards.includes(targetId)) {
        errors.push({
          type: "BODYGUARD_BLOCKING" as const,
          bodyguardId: readyBodyguards[0],
        });
      }
    }
  } else if (isLocation(targetCard)) {
    // Locations can be challenged anytime (Rule 4.3.6.19-22)
    // No additional restrictions
  } else {
    // Items cannot be challenged
    errors.push({ type: "INVALID_TARGET" as const });
  }

  if (errors.length > 0) {
    return invalidMove(...errors);
  }

  return validMove();
}

/**
 * Check if a challenge is valid
 */
export function canChallenge(
  challengerCard: LorcanaCardDefinition | undefined,
  challengerState: CardInstanceState | undefined,
  challengerOwner: PlayerId,
  targetCard: LorcanaCardDefinition | undefined,
  targetState: CardInstanceState | undefined,
  targetOwner: PlayerId,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
  readyBodyguards: CardId[],
): boolean {
  const result = validateChallenge(
    challengerCard,
    challengerState,
    challengerOwner,
    targetCard,
    targetState,
    targetOwner,
    activePlayerId,
    isMainPhase,
    readyBodyguards,
  );
  return result.valid;
}

/**
 * Calculate damage dealt by a character in challenge
 */
export function calculateChallengeDamage(
  card: LorcanaCardDefinition,
  isChallenger: boolean,
  additionalModifiers: DamageModifier[] = [],
): DamageCalculation {
  const baseStrength = getStrength(card);
  const modifiers: DamageModifier[] = [...additionalModifiers];

  // Challenger bonus only applies when attacking (Rule 10.3)
  if (isChallenger) {
    const challengerBonus = getTotalKeywordValue(card.keywords, "Challenger");
    if (challengerBonus > 0) {
      modifiers.push({
        source: "keyword",
        type: "challenger",
        amount: challengerBonus,
      });
    }
  }

  const totalModifier = modifiers.reduce((sum, m) => sum + m.amount, 0);
  const totalDamage = Math.max(0, baseStrength + totalModifier);

  return {
    baseStrength,
    modifiers,
    totalDamage,
  };
}

/**
 * Calculate damage after Resist reduction
 */
export function applyResist(
  incomingDamage: number,
  targetCard: LorcanaCardDefinition,
): number {
  const resistValue = getTotalKeywordValue(targetCard.keywords, "Resist");
  return Math.max(0, incomingDamage - resistValue);
}

/**
 * Check if damage would banish a card
 */
export function wouldBanish(
  currentDamage: number,
  incomingDamage: number,
  card: LorcanaCardDefinition,
): boolean {
  const willpower = getWillpower(card);
  return currentDamage + incomingDamage >= willpower;
}

/**
 * Get all ready bodyguards for an opponent
 */
export function getReadyBodyguards(
  opponentCharacters: Array<{
    cardId: CardId;
    card: LorcanaCardDefinition;
    state: CardInstanceState;
  }>,
): CardId[] {
  return opponentCharacters
    .filter(
      ({ card, state }) =>
        hasBodyguard(card) && state.state === "ready" && !state.isDrying,
    )
    .map(({ cardId }) => cardId);
}

/**
 * Get all challengeable targets for a challenger
 */
export function getChallengeableTargets(
  challengerCard: LorcanaCardDefinition,
  opponentCards: Array<{
    cardId: CardId;
    card: LorcanaCardDefinition;
    state: CardInstanceState;
  }>,
): CardId[] {
  const attackerHasEvasive = hasEvasive(challengerCard);
  const readyBodyguards = getReadyBodyguards(opponentCards);

  return opponentCards
    .filter(({ card, state }) => {
      // Must be character or location
      if (!(isCharacter(card) || isLocation(card))) {
        return false;
      }

      // Locations can always be challenged
      if (isLocation(card)) {
        return true;
      }

      // Characters: check exerted status (unless Evasive)
      if (!attackerHasEvasive && state.state !== "exerted") {
        return false;
      }

      // Check Bodyguard blocking (unless Evasive)
      if (!attackerHasEvasive && readyBodyguards.length > 0) {
        return readyBodyguards.includes(card.id as CardId);
      }

      return true;
    })
    .map(({ cardId }) => cardId);
}
