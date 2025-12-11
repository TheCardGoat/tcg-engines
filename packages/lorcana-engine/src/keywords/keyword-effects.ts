/**
 * Keyword Effects
 *
 * Implementations for keyword effect logic.
 */

import { hasKeyword, hasRush, hasVanish, hasWard } from "../card-utils";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import {
  getSingerValue,
  getSingTogetherValue,
  getTotalKeywordValue,
} from "../types/keywords";
import type { CardInstanceState } from "../zones/card-state";
import type {
  SingerPayment,
  StackingKeywordTotal,
  SupportContext,
  VanishRedirect,
  WardCheckResult,
} from "./keyword-types";

// =============================================================================
// Rush (Rule 10.7)
// =============================================================================

/**
 * Check if a card can bypass drying requirement due to Rush
 * Rush allows a character to challenge, quest, or use exert abilities
 * on the turn they are played.
 */
export function canBypassDrying(card: LorcanaCardDefinition): boolean {
  return hasRush(card);
}

/**
 * Check if card needs to observe drying requirement
 * (inverse of canBypassDrying for clarity)
 */
export function needsDryRequirement(card: LorcanaCardDefinition): boolean {
  return !hasRush(card);
}

// =============================================================================
// Support (Rule 10.11)
// =============================================================================

/**
 * Create support bonus context when a Support character quests.
 * Support: When this character quests, you may add their Strength
 * to another chosen character's Strength this turn.
 *
 * Note: This function should be called when the Support character QUESTS,
 * not when it enters play. The effect gives +Strength equal to the Support character's Strength.
 */
export function createSupportBonus(
  supporterId: CardId,
  supporterCard: LorcanaCardDefinition,
  targetId: CardId,
): SupportContext {
  const bonusAmount = supporterCard.strength ?? 0;
  return {
    supporterId,
    targetId,
    bonusAmount,
    expiresAtEndOfTurn: true,
  };
}

/**
 * Get valid support targets (other characters, not self).
 * Targets must be characters owned by the same player.
 */
export function getValidSupportTargets(
  supporterId: CardId,
  allCharacters: Array<{ cardId: CardId; owner: PlayerId; zone?: string }>,
  supporterOwner: PlayerId,
): CardId[] {
  return allCharacters
    .filter(
      ({ cardId, owner, zone }) =>
        cardId !== supporterId &&
        owner === supporterOwner &&
        // Ensure character is in play (default assumption if zone is missing, but good to check)
        (zone === undefined || zone === "play"),
    )
    .map(({ cardId }) => cardId);
}

/**
 * Check if Support can be applied (character has Support keyword)
 */
export function hasSupportKeyword(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Support");
}

/**
 * @deprecated Use hasSupportKeyword instead
 */
export const hasSupport = hasSupportKeyword;

// =============================================================================
// Vanish (Rule 10.12)
// =============================================================================

/**
 * Check if Vanish should redirect card to discard
 * Vanish only triggers when leaving play to hand or deck.
 */
export function shouldVanishRedirect(
  card: LorcanaCardDefinition,
  destinationZone: "hand" | "deck" | "discard" | "inkwell",
): boolean {
  if (!hasVanish(card)) {
    return false;
  }
  // Only redirect if going to hand or deck
  return destinationZone === "hand" || destinationZone === "deck";
}

/**
 * Get the vanish redirect result
 */
export function getVanishRedirect(
  cardId: CardId,
  card: LorcanaCardDefinition,
  originalDestination: "hand" | "deck",
): VanishRedirect | null {
  if (!hasVanish(card)) {
    return null;
  }
  return {
    originalDestination,
    actualDestination: "discard",
    cardId,
  };
}

// =============================================================================
// Ward (Rule 10.13)
// =============================================================================

/**
 * Check if card is protected by Ward from opponent abilities
 * Ward prevents opponent from choosing this card with abilities.
 * Does NOT prevent:
 * - Being challenged
 * - Effects that affect "all characters"
 * - Own abilities targeting this card
 */
export function checkWardProtection(
  targetCard: LorcanaCardDefinition,
  targetOwner: PlayerId,
  sourcePlayerId: PlayerId,
  selectionType: "chosen" | "random" | "all" = "chosen",
): WardCheckResult {
  // Ward only protects against being "chosen"
  if (selectionType !== "chosen") {
    return { protected: false };
  }

  // Ward doesn't protect from own abilities
  if (targetOwner === sourcePlayerId) {
    return { protected: false };
  }

  if (hasWard(targetCard)) {
    return {
      protected: true,
      reason: "ward",
      byPlayerId: sourcePlayerId,
    };
  }

  return { protected: false };
}

/**
 * Check if a card can be chosen by a player's ability
 */
export function canBeChosenBy(
  targetCard: LorcanaCardDefinition,
  targetOwner: PlayerId,
  byPlayerId: PlayerId,
): boolean {
  const wardCheck = checkWardProtection(targetCard, targetOwner, byPlayerId);
  return !wardCheck.protected;
}

// =============================================================================
// Stacking Keywords (Challenger, Resist)
// =============================================================================

/**
 * Calculate total Challenger value including all sources
 */
export function calculateTotalChallenger(
  card: LorcanaCardDefinition,
  additionalModifiers: Array<{
    source: CardId | "ability" | "effect";
    amount: number;
  }> = [],
): StackingKeywordTotal {
  const baseValue = getTotalKeywordValue(card.keywords, "Challenger");
  const allModifiers = [...additionalModifiers];

  const totalValue =
    baseValue + allModifiers.reduce((sum, m) => sum + m.amount, 0);

  return {
    keyword: "Challenger",
    baseValue,
    modifiers: allModifiers,
    totalValue: Math.max(0, totalValue),
  };
}

/**
 * Calculate total Resist value including all sources
 */
export function calculateTotalResist(
  card: LorcanaCardDefinition,
  additionalModifiers: Array<{
    source: CardId | "ability" | "effect";
    amount: number;
  }> = [],
): StackingKeywordTotal {
  const baseValue = getTotalKeywordValue(card.keywords, "Resist");
  const allModifiers = [...additionalModifiers];

  const totalValue =
    baseValue + allModifiers.reduce((sum, m) => sum + m.amount, 0);

  return {
    keyword: "Resist",
    baseValue,
    modifiers: allModifiers,
    totalValue: Math.max(0, totalValue),
  };
}

// =============================================================================
// Singer & Sing Together (Rules 10.9-10.10)
// =============================================================================

/**
 * Check if a character can sing a song
 */
export function canSingSong(
  singerCard: LorcanaCardDefinition,
  singerState: CardInstanceState,
  songCost: number,
): boolean {
  const singerValue = getSingerValue(singerCard.keywords);
  if (singerValue === null || singerValue < songCost) {
    return false;
  }
  // Singer must be dry (not summoning sick)
  if (singerState.isDrying) {
    return false;
  }
  // Singer must be ready (not already exerted)
  if (singerState.state === "exerted") {
    return false;
  }
  return true;
}

/**
 * Check if multiple characters can Sing Together to play a song
 */
export function canSingTogether(
  singers: Array<{
    card: LorcanaCardDefinition;
    state: CardInstanceState;
  }>,
  songCost: number,
): boolean {
  // All singers must be dry and ready
  const allReady = singers.every(
    ({ state }) => !state.isDrying && state.state === "ready",
  );
  if (!allReady) {
    return false;
  }

  // Calculate combined Singer/Sing Together value
  const totalValue = singers.reduce((sum, { card }) => {
    const singerVal = getSingerValue(card.keywords) ?? 0;
    const singTogetherVal = getSingTogetherValue(card.keywords) ?? 0;
    return sum + Math.max(singerVal, singTogetherVal);
  }, 0);

  return totalValue >= songCost;
}

/**
 * Create singer payment info
 */
export function createSingerPayment(
  singerIds: CardId[],
  singerCards: LorcanaCardDefinition[],
  songCost: number,
): SingerPayment {
  const totalValue = singerCards.reduce((sum, card) => {
    const singerVal = getSingerValue(card.keywords) ?? 0;
    const singTogetherVal = getSingTogetherValue(card.keywords) ?? 0;
    return sum + Math.max(singerVal, singTogetherVal);
  }, 0);

  return {
    type: singerIds.length === 1 ? "single" : "sing_together",
    singerIds,
    totalValue,
    songCost,
  };
}
