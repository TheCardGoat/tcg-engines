/**
 * Parser stub for v2 tests.
 * Provides compatibility with the old parser API.
 */

import type { ParseResult } from "../types";
import { parserV2 } from "./index";
import { MANUAL_ENTRIES_BY_NAME } from "./manual-overrides";

interface ParseOptions {
  cardName?: string;
}

/**
 * Parse ability text - old API compatibility.
 */
export function parseAbilityText(
  text: string,
  options?: ParseOptions,
): ParseResult {
  // Check for manual override by card name
  if (options?.cardName && MANUAL_ENTRIES_BY_NAME[options.cardName]) {
    const entry = MANUAL_ENTRIES_BY_NAME[options.cardName];
    // entry can be AbilityWithText or AbilityWithText[]
    const singleEntry = Array.isArray(entry) ? entry[0] : entry;
    // Ensure we return the entry as AbilityWithText structure
    return {
      success: true,
      ability: {
        name: (singleEntry as any).name,
        ability: (singleEntry as any).ability,
        text: (singleEntry as any).text || text,
      },
      warnings: [],
    };
  }

  const ability = parserV2.parseAbility(text);
  if (ability) {
    // Extract name from ability if present (for named abilities)
    const name = (ability as { name?: string }).name;
    return {
      success: true,
      ability: {
        name,
        // TODO: Type assertion needed because @tcg/lorcana-engine and @tcg/lorcana-types
        // have incompatible Ability, Trigger, and Target types. This is a broader
        // architectural issue that needs to be resolved by re-exporting all ability
        // types from lorcana-types in the engine, similar to what was done for Condition.
        // See: packages/lorcana-engine/src/cards/abilities/types/condition-types.ts
        ability: ability as any,
        text, // Include original text
      },
      warnings: [],
    };
  }
  return {
    success: false,
    ability: null,
    warnings: ["Failed to parse ability"],
  };
}

interface BatchResult {
  results: ParseResult[];
  total: number;
  successful: number;
  failed: number;
}

/**
 * Parse multiple ability texts.
 */
export function parseAbilityTexts(texts: string[]): BatchResult {
  const results = texts.map((text) => parseAbilityText(text));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    results,
    total: texts.length,
    successful,
    failed,
  };
}
