/**
 * Shared utility functions for effect parsers.
 */

import type { CardType } from "../types";

/**
 * Parse card type from string.
 * Validates the input against known Lorcana card types.
 *
 * @param str - The string to parse
 * @returns The CardType if valid, or undefined
 */
export function parseCardType(
  str: string,
): CardType | "song" | "floodborn" | undefined {
  const normalized = str.toLowerCase();
  const validTypes = [
    "character",
    "action",
    "item",
    "location",
    "song",
    "floodborn",
  ] as const;

  if (validTypes.includes(normalized as (typeof validTypes)[number])) {
    return normalized as CardType | "song" | "floodborn";
  }

  return undefined;
}
