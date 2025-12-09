/**
 * Card Utilities
 *
 * Type guards and utility functions for working with Lorcana cards.
 */

import type { LorcanaCardDefinition } from "./types/card-types";
import { getFullName as cardGetFullName } from "./types/card-types";
import {
  getShiftKeyword,
  getTotalKeywordValue,
  hasKeywordType,
  type Keyword,
  type KeywordType,
  getSingerValue as keywordGetSingerValue,
  getSingTogetherValue as keywordGetSingTogetherValue,
  getKeywordValue as keywordGetValue,
} from "./types/keywords";

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

/**
 * Check if a card has a specific keyword
 */
export function hasKeyword(
  card: LorcanaCardDefinition,
  keyword: string,
): boolean {
  return hasKeywordType(card.keywords, keyword as KeywordType);
}

/**
 * Get the value of a parameterized keyword (Challenger, Resist)
 * Returns null if the keyword is not present
 */
export function getKeywordValue(
  card: LorcanaCardDefinition,
  keyword: "Challenger" | "Resist",
): number | null {
  return keywordGetValue(card.keywords, keyword);
}

/**
 * Get the total stacked value of a parameterized keyword
 */
export function getTotalKeyword(
  card: LorcanaCardDefinition,
  keyword: "Challenger" | "Resist",
): number {
  return getTotalKeywordValue(card.keywords, keyword);
}

/**
 * Get all keywords on a card
 */
export function getAllKeywords(card: LorcanaCardDefinition): Keyword[] {
  return card.keywords ?? [];
}

/**
 * Check if a card has Shift keyword
 */
export function hasShift(card: LorcanaCardDefinition): boolean {
  return getShiftKeyword(card.keywords) !== null;
}

/**
 * Get the Shift cost if present
 */
export function getShiftCost(card: LorcanaCardDefinition): number | null {
  return getShiftKeyword(card.keywords)?.cost ?? null;
}

/**
 * Get the Shift target name if present
 */
export function getShiftTargetName(card: LorcanaCardDefinition): string | null {
  return getShiftKeyword(card.keywords)?.targetName ?? null;
}

/**
 * Get the Singer value if present
 */
export function getSingerValue(card: LorcanaCardDefinition): number | null {
  return keywordGetSingerValue(card.keywords);
}

/**
 * Get the Sing Together value if present
 */
export function getSingTogetherValue(
  card: LorcanaCardDefinition,
): number | null {
  return keywordGetSingTogetherValue(card.keywords);
}

/**
 * Check if a character has Bodyguard
 */
export function hasBodyguard(card: LorcanaCardDefinition): boolean {
  return hasKeywordType(card.keywords, "Bodyguard");
}

/**
 * Check if a character has Evasive
 */
export function hasEvasive(card: LorcanaCardDefinition): boolean {
  return hasKeywordType(card.keywords, "Evasive");
}

/**
 * Check if a character has Reckless
 */
export function hasReckless(card: LorcanaCardDefinition): boolean {
  return hasKeywordType(card.keywords, "Reckless");
}

/**
 * Check if a character has Rush
 */
export function hasRush(card: LorcanaCardDefinition): boolean {
  return hasKeywordType(card.keywords, "Rush");
}

/**
 * Check if a character has Ward
 */
export function hasWard(card: LorcanaCardDefinition): boolean {
  return hasKeywordType(card.keywords, "Ward");
}

/**
 * Check if a character has Vanish
 */
export function hasVanish(card: LorcanaCardDefinition): boolean {
  return hasKeywordType(card.keywords, "Vanish");
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
