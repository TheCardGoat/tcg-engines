/**
 * Manual Overrides for Complex Card Texts
 *
 * Some card texts are too complex to parse generically. This module provides
 * a way to manually define the JSON representation for such texts.
 *
 * To add a new manual entry:
 * 1. Add the exact text (after normalization) as a key in MANUAL_ENTRIES
 * 2. Provide the complete AbilityWithText structure as the value
 * 3. Ensure the structure matches the expected Ability type
 *
 * @example
 * ```typescript
 * MANUAL_ENTRIES = {
 *   "COMPLEX TEXT HERE": {
 *     text: "COMPLEX TEXT HERE",
 *     ability: {
 *       type: "triggered",
 *       trigger: { event: "QUEST", timing: "whenever" },
 *       effect: { type: "draw", amount: 1, target: "CONTROLLER" }
 *     }
 *   }
 * }
 * ```
 */

import type { Ability } from "@tcg/lorcana";
import type { AbilityWithText } from "./types";

/**
 * Manual entries for complex card texts
 *
 * Maps exact normalized text strings to their manual JSON representations.
 * These texts bypass the generic parser and use the provided structure directly.
 */
export const MANUAL_ENTRIES: Record<string, AbilityWithText> = {
  // Add manual entries here as needed
  // Example structure:
  // "COMPLEX TEXT": {
  //   text: "COMPLEX TEXT",
  //   ability: {
  //     type: "triggered",
  //     trigger: { event: "QUEST", timing: "whenever" },
  //     effect: { type: "draw", amount: 1, target: "CONTROLLER" }
  //   }
  // }
};

/**
 * Check if a text is marked as too complex to parse generically
 *
 * @param text - Normalized text to check
 * @returns true if the text exists in MANUAL_ENTRIES
 */
export function tooComplexText(text: string): boolean {
  return text in MANUAL_ENTRIES;
}

/**
 * Get the manual entry for a complex text
 *
 * @param text - Normalized text to look up
 * @returns The manual AbilityWithText entry if it exists, undefined otherwise
 */
export function getManualEntry(text: string): AbilityWithText | undefined {
  return MANUAL_ENTRIES[text];
}
