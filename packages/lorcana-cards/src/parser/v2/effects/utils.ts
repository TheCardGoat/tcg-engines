/**
 * Shared utility functions for effect parsers.
 */

import type { CardType } from "../types";

/**
 * Parse card type from string.
 * Validates the input against known Lorcana card types.
 *
 * Maps "song" to "action" since songs are a subtype of actions.
 * Rejects "floodborn" as it's a classification, not a card type.
 *
 * @param str - The string to parse
 * @returns The CardType if valid, or undefined
 */
export function parseCardType(str: string): CardType | undefined {
  const normalized = str.toLowerCase();

  // Map "song" to "action" (songs are actions)
  if (normalized === "song") {
    return "action";
  }

  // Valid card types
  const validTypes: CardType[] = ["character", "action", "item", "location"];

  if (validTypes.includes(normalized as CardType)) {
    return normalized as CardType;
  }

  return undefined;
}
