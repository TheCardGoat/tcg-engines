/**
 * Card Utilities
 *
 * Type guards and utility functions for working with Lorcana cards.
 */

import type {
  KeywordAbility,
  ParameterizedKeywordType,
} from "./cards/abilities/types/ability-types";
import {
  isParameterizedKeywordAbility,
  isShiftKeywordAbility,
  isValueKeywordAbility,
} from "./cards/abilities/types/ability-types";
import type {
  AbilityDefinition,
  KeywordAbilityDefinition,
  LorcanaCardDefinition,
} from "./types/card-types";
import { getFullName as cardGetFullName } from "./types/card-types";

// Re-export getFullName for convenience
export const getFullName = cardGetFullName;

/**
 * Check if a card is a character (Rule 6.1.2)
 * Characters have strength and willpower
 */
export function isCharacter(card: LorcanaCardDefinition): boolean {
  return card.cardType === "character";
}

/**
 * Check if a card is an action (Rule 6.3.1)
 */
export function isAction(card: LorcanaCardDefinition): boolean {
  return card.cardType === "action";
}

/**
 * Check if a card is a song (Rule 6.3.3)
 * Songs are actions with the "song" subtype
 */
export function isSong(card: LorcanaCardDefinition): boolean {
  return card.cardType === "action" && card.actionSubtype === "song";
}

/**
 * Check if a card is an item (Rule 6.4.1)
 */
export function isItem(card: LorcanaCardDefinition): boolean {
  return card.cardType === "item";
}

/**
 * Check if a card is a location (Rule 6.5.1)
 */
export function isLocation(card: LorcanaCardDefinition): boolean {
  return card.cardType === "location";
}

// ============================================================================
// Keyword Utilities (Updated for AbilityDefinition)
// ============================================================================

/**
 * Helper to get all keyword abilities from a card
 */
function getKeywordAbilities(
  card: LorcanaCardDefinition,
): KeywordAbilityDefinition[] {
  if (!card.abilities) return [];
  return card.abilities.filter(
    (a): a is KeywordAbilityDefinition => a.type === "keyword",
  );
}

/**
 * Check if a card has a specific keyword
 */
export function hasKeyword(
  card: LorcanaCardDefinition,
  keyword: string,
): boolean {
  return getKeywordAbilities(card).some((k) => k.keyword === keyword);
}

/**
 * Get the value of a parameterized keyword (Challenger, Resist)
 * Returns null if the keyword is not present
 */
export function getKeywordValue(
  card: LorcanaCardDefinition,
  keyword: ParameterizedKeywordType,
): number | null {
  const kw = getKeywordAbilities(card).find(
    (k) => k.keyword === keyword && isParameterizedKeywordAbility(k),
  );
  if (!(kw && isParameterizedKeywordAbility(kw))) return null;
  return kw.value;
}

/**
 * Get the total stacked value of a parameterized keyword
 */
export function getTotalKeyword(
  card: LorcanaCardDefinition,
  keyword: ParameterizedKeywordType,
): number {
  return getKeywordAbilities(card)
    .filter((k) => k.keyword === keyword && isParameterizedKeywordAbility(k))
    .reduce((sum, k) => {
      if (isParameterizedKeywordAbility(k)) {
        return sum + k.value;
      }
      return sum;
    }, 0);
}

/**
 * Get all keywords on a card (as KeywordAbility objects)
 */
export function getAllKeywords(
  card: LorcanaCardDefinition,
): KeywordAbilityDefinition[] {
  return getKeywordAbilities(card);
}

/**
 * Check if a card has Shift keyword
 */
export function hasShift(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Shift");
}

/**
 * Get the Shift cost if present
 * Note: Returns number if ink cost, or null. Logic simplified for ink cost.
 * If cost is complex, this might need update, but for now assuming ink cost.
 */
export function getShiftCost(card: LorcanaCardDefinition): number | null {
  const shift = getKeywordAbilities(card).find(
    (k) => k.keyword === "Shift" && isShiftKeywordAbility(k),
  );
  if (!(shift && isShiftKeywordAbility(shift))) return null;

  // Assuming 'ink' cost for now as per previous types
  if ("ink" in shift.cost) {
    return shift.cost.ink ?? null;
  }
  return null;
}

/**
 * Get the Shift target name if present
 */
export function getShiftTargetName(card: LorcanaCardDefinition): string | null {
  const shift = getKeywordAbilities(card).find(
    (k) => k.keyword === "Shift" && isShiftKeywordAbility(k),
  );
  if (!(shift && isShiftKeywordAbility(shift))) return null;
  return shift.shiftTarget ?? null;
}

/**
 * Get the Singer value if present
 */
export function getSingerValue(card: LorcanaCardDefinition): number | null {
  const singer = getKeywordAbilities(card).find(
    (k) => k.keyword === "Singer" && isValueKeywordAbility(k),
  );
  if (!(singer && isValueKeywordAbility(singer))) return null;
  return singer.value;
}

/**
 * Get the Sing Together value if present
 */
export function getSingTogetherValue(
  card: LorcanaCardDefinition,
): number | null {
  const singTogether = getKeywordAbilities(card).find(
    (k) => k.keyword === "SingTogether" && isValueKeywordAbility(k),
  );
  if (!(singTogether && isValueKeywordAbility(singTogether))) return null;
  return singTogether.value;
}

/**
 * Check if a character has Bodyguard
 */
export function hasBodyguard(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Bodyguard");
}

/**
 * Check if a character has Evasive
 */
export function hasEvasive(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Evasive");
}

/**
 * Check if a character has Reckless
 */
export function hasReckless(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Reckless");
}

/**
 * Check if a character has Rush
 */
export function hasRush(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Rush");
}

/**
 * Check if a character has Ward
 */
export function hasWard(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Ward");
}

/**
 * Check if a character has Vanish
 */
export function hasVanish(card: LorcanaCardDefinition): boolean {
  return hasKeyword(card, "Vanish");
}

/**
 * Check if a card can be put into the inkwell (has inkwell symbol)
 */
export function canInk(card: LorcanaCardDefinition): boolean {
  return card.inkable;
}

/**
 * Check if a card can quest (is a character without Reckless)
 */
export function canQuest(card: LorcanaCardDefinition): boolean {
  return isCharacter(card) && !hasReckless(card);
}

/**
 * Get the lore value of a card (for questing)
 */
export function getLoreValue(card: LorcanaCardDefinition): number {
  return card.lore ?? 0;
}

/**
 * Get the strength of a character
 */
export function getStrength(card: LorcanaCardDefinition): number {
  return card.strength ?? 0;
}

/**
 * Get the willpower of a card (character or location)
 */
export function getWillpower(card: LorcanaCardDefinition): number {
  return card.willpower ?? 0;
}

/**
 * Get the move cost of a location
 */
export function getMoveCost(card: LorcanaCardDefinition): number | null {
  return isLocation(card) ? (card.moveCost ?? null) : null;
}

/**
 * Check if two cards have the same name (ignoring version)
 * Used for Shift targeting
 */
export function hasSameName(
  card1: LorcanaCardDefinition,
  card2: LorcanaCardDefinition,
): boolean {
  return card1.name === card2.name;
}

/**
 * Check if a card has a two-part name with ampersand (Rule 6.2.4.1)
 * e.g., "Flotsam & Jetsam"
 */
export function hasAmpersandName(card: LorcanaCardDefinition): boolean {
  return card.name.includes(" & ");
}

/**
 * Get both name parts for cards with ampersand (Rule 6.2.4.1)
 * Returns null if card doesn't have ampersand name
 */
export function getAmpersandNames(
  card: LorcanaCardDefinition,
): [string, string] | null {
  if (!hasAmpersandName(card)) return null;
  const parts = card.name.split(" & ");
  if (parts.length !== 2) return null;
  return [parts[0], parts[1]];
}
