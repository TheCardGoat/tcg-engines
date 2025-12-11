/**
 * Play Card Move (Rule 4.3.4)
 *
 * Play card from hand logic:
 * - Card must be in hand
 * - Pay cost via ink or alternate method (Shift, Singer)
 * - Characters/Items/Locations enter play
 * - Actions resolve then discard
 */

import { isSong } from "../card-utils";
import type { TurnTrackers } from "../flow/turn-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId } from "../types/game-state";
import {
  getShiftKeyword,
  getSingerValue,
  getSingTogetherValue,
} from "../types/keywords";
import type { CardInstanceState } from "../zones/card-state";
import {
  type CostCalculation,
  type CostModifier,
  invalidMove,
  isShiftPayment,
  isSingerPayment,
  isSingTogetherPayment,
  type MoveValidationError,
  type MoveValidationResult,
  type PaymentMethod,
  validMove,
} from "./move-types";

/**
 * Calculate the cost to play a card
 */
export function calculateCost(
  card: LorcanaCardDefinition,
  payment: PaymentMethod,
  costModifiers?: CostModifier[],
): CostCalculation {
  const baseCost = card.cost;
  const increases: CostModifier[] = [];
  const reductions: CostModifier[] = [];

  // Apply any external modifiers
  if (costModifiers) {
    for (const mod of costModifiers) {
      if (mod.amount >= 0) {
        increases.push(mod);
      } else {
        reductions.push({ ...mod, amount: Math.abs(mod.amount) });
      }
    }
  }

  // If using Shift, use shift cost instead
  if (isShiftPayment(payment)) {
    const shiftKeyword = getShiftKeyword(card.keywords);
    if (shiftKeyword) {
      const shiftCost = shiftKeyword.cost;
      // Shift cost replaces base cost, but modifiers still apply
      const totalIncreases = increases.reduce((sum, m) => sum + m.amount, 0);
      const totalReductions = reductions.reduce((sum, m) => sum + m.amount, 0);
      const totalCost = Math.max(
        0,
        shiftCost + totalIncreases - totalReductions,
      );

      return {
        baseCost: shiftCost,
        increases,
        reductions,
        totalCost,
      };
    }
  }

  // Standard cost calculation
  const totalIncreases = increases.reduce((sum, m) => sum + m.amount, 0);
  const totalReductions = reductions.reduce((sum, m) => sum + m.amount, 0);
  const totalCost = Math.max(0, baseCost + totalIncreases - totalReductions);

  return {
    baseCost,
    increases,
    reductions,
    totalCost,
  };
}

/**
 * Validate shift payment
 */
export function validateShiftPayment(
  cardToPlay: LorcanaCardDefinition,
  targetCard: LorcanaCardDefinition | undefined,
  targetCardState: CardInstanceState | undefined,
): MoveValidationResult {
  const shiftKeyword = getShiftKeyword(cardToPlay.keywords);

  if (!shiftKeyword) {
    return invalidMove({
      type: "INVALID_SHIFT_TARGET",
      reason: "Card does not have Shift keyword",
    });
  }

  if (!targetCard) {
    return invalidMove({
      type: "INVALID_SHIFT_TARGET",
      reason: "Target card not found",
    });
  }

  // Target must have matching name
  if (targetCard.name !== shiftKeyword.targetName) {
    return invalidMove({
      type: "INVALID_SHIFT_TARGET",
      expectedName: shiftKeyword.targetName,
      actualName: targetCard.name,
    });
  }

  // Target must be in play (cardState exists)
  if (!targetCardState) {
    return invalidMove({
      type: "INVALID_SHIFT_TARGET",
      reason: "Target card is not in play",
    });
  }

  return validMove();
}

/**
 * Validate singer payment
 */
export function validateSingerPayment(
  songToPlay: LorcanaCardDefinition,
  singerCard: LorcanaCardDefinition | undefined,
  singerState: CardInstanceState | undefined,
): MoveValidationResult {
  // Card being played must be a song
  if (!isSong(songToPlay)) {
    return invalidMove({ type: "NOT_A_SONG" });
  }

  if (!(singerCard && singerState)) {
    return invalidMove({
      type: "INVALID_SINGER",
      reason: "Singer card not found or not in play",
    });
  }

  // Singer must be dry
  if (singerState.isDrying) {
    return invalidMove({ type: "SINGER_NOT_DRY" });
  }

  // Singer must have Singer keyword with sufficient value
  const singerValue = getSingerValue(singerCard.keywords);
  if (singerValue === null) {
    return invalidMove({
      type: "INVALID_SINGER",
      reason: "Card does not have Singer keyword",
    });
  }

  if (singerValue < songToPlay.cost) {
    return invalidMove({
      type: "SINGER_VALUE_TOO_LOW",
      singerValue,
      songCost: songToPlay.cost,
    });
  }

  return validMove();
}

/**
 * Validate sing together payment
 */
export function validateSingTogetherPayment(
  songToPlay: LorcanaCardDefinition,
  singers: Array<{
    card: LorcanaCardDefinition;
    state: CardInstanceState;
  }>,
): MoveValidationResult {
  // Card being played must be a song
  if (!isSong(songToPlay)) {
    return invalidMove({ type: "NOT_A_SONG" });
  }

  // All singers must be dry and have Sing Together
  let totalSingValue = 0;

  for (const { card, state } of singers) {
    if (state.isDrying) {
      return invalidMove({ type: "SINGER_NOT_DRY" });
    }

    const singTogetherValue = getSingTogetherValue(card.keywords);
    if (singTogetherValue === null) {
      return invalidMove({
        type: "INVALID_SINGER",
        reason: `${card.name} does not have Sing Together keyword`,
      });
    }

    totalSingValue += singTogetherValue;
  }

  if (totalSingValue < songToPlay.cost) {
    return invalidMove({
      type: "SINGER_VALUE_TOO_LOW",
      singerValue: totalSingValue,
      songCost: songToPlay.cost,
    });
  }

  return validMove();
}

/**
 * Validate playing a card
 */
export function validatePlayCard(
  card: LorcanaCardDefinition | undefined,
  isInHand: boolean,
  payment: PaymentMethod,
  availableInk: number,
  turnTrackers: TurnTrackers,
  isActivePlayer: boolean,
  isMainPhase: boolean,
  costModifiers?: CostModifier[],
  context?: {
    // For Shift
    targetCard?: LorcanaCardDefinition;
    targetCardState?: CardInstanceState;
    // For Singer
    singerCard?: LorcanaCardDefinition;
    singerState?: CardInstanceState;
    // For Sing Together
    singers?: Array<{
      card: LorcanaCardDefinition;
      state: CardInstanceState;
    }>;
  },
): MoveValidationResult {
  const errors: MoveValidationError[] = [];

  // Must be active player's turn
  if (!isActivePlayer) {
    errors.push({ type: "NOT_YOUR_TURN" as const });
  }

  // Must be main phase
  if (!isMainPhase) {
    errors.push({ type: "NOT_MAIN_PHASE" as const });
  }

  // Card must exist
  if (!card) {
    errors.push({ type: "CARD_NOT_FOUND" as const });
    return invalidMove(...errors);
  }

  // Card must be in hand (unless using Shift from play, but that's different)
  if (!isInHand) {
    errors.push({ type: "NOT_IN_HAND" as const });
  }

  // Check ink payment
  if (payment.type === "ink") {
    const cost = calculateCost(card, payment, costModifiers);
    if (cost.totalCost > availableInk) {
      errors.push({
        type: "INSUFFICIENT_INK" as const,
        required: cost.totalCost,
        available: availableInk,
      });
    }
  } else if (isShiftPayment(payment)) {
    if (!context?.targetCard || !context?.targetCardState) {
      // Missing context for validation
      errors.push({ type: "INVALID_PAYMENT_METHOD" as const });
    } else {
      const shiftResult = validateShiftPayment(
        card,
        context.targetCard,
        context.targetCardState,
      );
      if (!shiftResult.valid) {
        errors.push(...shiftResult.errors);
      }
    }
  } else if (isSingerPayment(payment)) {
    if (!context?.singerCard || !context?.singerState) {
      errors.push({ type: "INVALID_PAYMENT_METHOD" as const });
    } else {
      const singerResult = validateSingerPayment(
        card,
        context.singerCard,
        context.singerState,
      );
      if (!singerResult.valid) {
        errors.push(...singerResult.errors);
      }
    }
  } else if (isSingTogetherPayment(payment)) {
    if (!context?.singers) {
      errors.push({ type: "INVALID_PAYMENT_METHOD" as const });
    } else {
      const singTogetherResult = validateSingTogetherPayment(
        card,
        context.singers,
      );
      if (!singTogetherResult.valid) {
        errors.push(...singTogetherResult.errors);
      }
    }
  }

  if (errors.length > 0) {
    return invalidMove(...errors);
  }

  return validMove();
}

/**
 * Check if a card can be played
 */
export function canPlayCard(
  card: LorcanaCardDefinition | undefined,
  isInHand: boolean,
  payment: PaymentMethod,
  availableInk: number,
  turnTrackers: TurnTrackers,
  isActivePlayer: boolean,
  isMainPhase: boolean,
  costModifiers?: CostModifier[],
  context?: {
    targetCard?: LorcanaCardDefinition;
    targetCardState?: CardInstanceState;
    singerCard?: LorcanaCardDefinition;
    singerState?: CardInstanceState;
    singers?: Array<{
      card: LorcanaCardDefinition;
      state: CardInstanceState;
    }>;
  },
): boolean {
  const result = validatePlayCard(
    card,
    isInHand,
    payment,
    availableInk,
    turnTrackers,
    isActivePlayer,
    isMainPhase,
    costModifiers,
    context,
  );
  return result.valid;
}
