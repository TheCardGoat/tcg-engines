/**
 * Card State (Section 5.1)
 *
 * Card states in Lorcana:
 * - Ready/Exerted (5.1.1-5.1.2)
 * - Damaged/Undamaged (5.1.3-5.1.4)
 * - Stack relationships (5.1.5-5.1.7) for Shift
 * - Drying state (summoning sickness)
 */

import type { CardId } from "../types/game-state";

/** Card ready/exerted state */
export type CardReadyState = "ready" | "exerted";

/**
 * Stack position for shifted cards (Rule 5.1.5-5.1.7)
 */
export interface StackPosition {
  /** Is this card underneath another card? */
  isUnder: boolean;
  /** If this is the top card, what's its ID? */
  topCardId?: CardId;
  /** If this is the top card, IDs of cards underneath */
  cardsUnderneath?: CardId[];
}

/**
 * Runtime state for a card instance in play
 */
export interface CardInstanceState {
  /** Unique instance ID */
  cardId: CardId;
  /** Ready or exerted (Rule 5.1.1-5.1.2) */
  state: CardReadyState;
  /** Damage counters (Rule 5.1.3-5.1.4) */
  damage: number;
  /** Drying = summoning sickness - can't quest/challenge/use exert abilities */
  isDrying: boolean;
  /** Stack position for Shift (Rule 5.1.5-5.1.7) */
  stackPosition?: StackPosition;
  /** Location this character is at (if any) */
  atLocationId?: CardId;
}

/**
 * Create default card instance state for a newly played card
 */
export function createCardInstanceState(
  cardId: CardId,
  options?: {
    isDrying?: boolean;
    state?: CardReadyState;
  },
): CardInstanceState {
  return {
    cardId,
    state: options?.state ?? "ready",
    damage: 0,
    isDrying: options?.isDrying ?? true, // Characters start drying
  };
}

/**
 * Check if a card is ready
 */
export function isReady(cardState: CardInstanceState): boolean {
  return cardState.state === "ready";
}

/**
 * Check if a card is exerted
 */
export function isExerted(cardState: CardInstanceState): boolean {
  return cardState.state === "exerted";
}

/**
 * Check if a card is drying (has summoning sickness)
 */
export function isDrying(cardState: CardInstanceState): boolean {
  return cardState.isDrying;
}

/**
 * Check if a card is dry (no summoning sickness)
 */
export function isDry(cardState: CardInstanceState): boolean {
  return !cardState.isDrying;
}

/**
 * Check if a card is damaged (has 1+ damage)
 */
export function isDamaged(cardState: CardInstanceState): boolean {
  return cardState.damage > 0;
}

/**
 * Get current damage on a card
 */
export function getDamage(cardState: CardInstanceState): number {
  return cardState.damage;
}

/**
 * Check if card is in a stack (shifted)
 */
export function isInStack(cardState: CardInstanceState): boolean {
  return cardState.stackPosition !== undefined;
}

/**
 * Check if card is the top of a stack
 */
export function isTopOfStack(cardState: CardInstanceState): boolean {
  const stack = cardState.stackPosition;
  return stack !== undefined && !stack.isUnder;
}

/**
 * Check if card is under another card in a stack
 */
export function isUnderCard(cardState: CardInstanceState): boolean {
  const stack = cardState.stackPosition;
  return stack !== undefined && stack.isUnder;
}

/**
 * Exert a card (turn sideways)
 */
export function exertCard(cardState: CardInstanceState): CardInstanceState {
  return { ...cardState, state: "exerted" };
}

/**
 * Ready a card (turn upright)
 */
export function readyCard(cardState: CardInstanceState): CardInstanceState {
  return { ...cardState, state: "ready" };
}

/**
 * Add damage to a card
 */
export function addDamage(
  cardState: CardInstanceState,
  amount: number,
): CardInstanceState {
  if (amount < 0) return cardState;
  return { ...cardState, damage: cardState.damage + amount };
}

/**
 * Remove damage from a card
 */
export function removeDamage(
  cardState: CardInstanceState,
  amount: number,
): CardInstanceState {
  if (amount < 0) return cardState;
  return { ...cardState, damage: Math.max(0, cardState.damage - amount) };
}

/**
 * Set damage to a specific value
 */
export function setDamage(
  cardState: CardInstanceState,
  damage: number,
): CardInstanceState {
  return { ...cardState, damage: Math.max(0, damage) };
}

/**
 * Set drying state
 */
export function setDrying(
  cardState: CardInstanceState,
  isDrying: boolean,
): CardInstanceState {
  return { ...cardState, isDrying };
}

/**
 * Clear drying state (character becomes dry)
 */
export function clearDrying(cardState: CardInstanceState): CardInstanceState {
  return { ...cardState, isDrying: false };
}

/**
 * Set the location a character is at
 */
export function setAtLocation(
  cardState: CardInstanceState,
  locationId: CardId | undefined,
): CardInstanceState {
  return { ...cardState, atLocationId: locationId };
}

/**
 * Create a stack by shifting onto a target
 * The new card goes on top, target goes underneath
 */
export function createStack(
  topCardState: CardInstanceState,
  underneathCardState: CardInstanceState,
): {
  topCard: CardInstanceState;
  underneathCard: CardInstanceState;
} {
  const topCard: CardInstanceState = {
    ...topCardState,
    // Damage carries over from underneath card (Rule 10.8.x)
    damage: underneathCardState.damage,
    // Shifted card is ready regardless of what's underneath
    state: "ready",
    isDrying: false, // Shifted cards are not drying
    stackPosition: {
      isUnder: false,
      cardsUnderneath: [underneathCardState.cardId],
    },
  };

  const underneathCard: CardInstanceState = {
    ...underneathCardState,
    stackPosition: {
      isUnder: true,
      topCardId: topCardState.cardId,
    },
  };

  return { topCard, underneathCard };
}

/**
 * Get all cards in a stack (including top card)
 */
export function getStackCardIds(cardState: CardInstanceState): CardId[] {
  if (!cardState.stackPosition) {
    return [cardState.cardId];
  }

  if (cardState.stackPosition.isUnder) {
    // This is an underneath card - return just this card
    // The full stack should be queried from the top card
    return [cardState.cardId];
  }

  // This is the top card
  return [cardState.cardId, ...(cardState.stackPosition.cardsUnderneath ?? [])];
}
