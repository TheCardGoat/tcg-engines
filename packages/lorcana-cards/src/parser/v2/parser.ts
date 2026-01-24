/**
 * Parser API for v2.
 * Provides compatibility with the old parser API and adds multi-parse support.
 */

import { parserV2 } from "./index";
import {
  getManualEntries,
  MANUAL_ENTRIES_BY_NAME,
  tooComplexText,
} from "./manual-overrides";
import { normalizeText } from "./preprocessor";
import type { AbilityWithText, ParseResult } from "./types";

interface ParseOptions {
  cardName?: string;
  strict?: boolean;
}

/**
 * Result for parsing multi-ability texts
 * Used when a single text contains multiple abilities
 */
export interface MultiParseResult {
  /** Whether parsing succeeded for all abilities */
  success: boolean;

  /** Parsed abilities (multiple for complex texts) */
  abilities: AbilityWithText[];

  /** Non-fatal warnings encountered during parsing */
  warnings?: string[];

  /** Fatal error message (if success is false) */
  error?: string;
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
        name: (singleEntry as { name?: string }).name,
        ability: (singleEntry as { ability: unknown }).ability,
        text: (singleEntry as { text?: string }).text || text,
      } as AbilityWithText,
      warnings: [],
    };
  }

  // Normalize and check for manual override by text pattern
  const normalizedText = normalizeText(text);
  if (tooComplexText(normalizedText)) {
    const manualEntries = getManualEntries(normalizedText, options?.cardName);
    if (manualEntries && manualEntries.length > 0) {
      return {
        success: true,
        ability: manualEntries[0],
        warnings: [],
      };
    }
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
        ability: ability as AbilityWithText["ability"],
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
export function parseAbilityTexts(
  texts: string[],
  options?: ParseOptions,
): BatchResult {
  const results = texts.map((text) => parseAbilityText(text, options));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    results,
    total: texts.length,
    successful,
    failed,
  };
}

/**
 * Parse ability text that may contain multiple abilities
 *
 * This function handles complex card texts that contain multiple abilities
 * (e.g., "ABILITY ONE Effect. ABILITY TWO Other effect.").
 *
 * For manual override entries, returns all abilities defined in the entry.
 * For regular texts, attempts to parse as a single ability.
 *
 * @param text - Raw ability text from card (may contain multiple abilities)
 * @param options - Parser options
 * @returns Multi-parse result with array of abilities
 *
 * @example
 * ```typescript
 * const result = parseAbilityTextMulti("ABILITY ONE Effect. ABILITY TWO Other.");
 * if (result.success) {
 *   console.log(`Found ${result.abilities.length} abilities`);
 * }
 * ```
 */
export function parseAbilityTextMulti(
  text: string,
  options?: ParseOptions,
): MultiParseResult {
  // Step 1: Preprocess text
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return {
      success: false,
      abilities: [],
      error: "Empty ability text",
    };
  }

  // Step 2: Check for manual override by card name first
  if (options?.cardName && MANUAL_ENTRIES_BY_NAME[options.cardName]) {
    const entry = MANUAL_ENTRIES_BY_NAME[options.cardName];
    const entries = Array.isArray(entry) ? entry : [entry];
    return {
      success: true,
      abilities: entries as AbilityWithText[],
    };
  }

  // Step 3: Check for manual override by text pattern
  if (tooComplexText(normalizedText)) {
    const manualEntries = getManualEntries(normalizedText, options?.cardName);
    if (manualEntries && manualEntries.length > 0) {
      return {
        success: true,
        abilities: manualEntries,
      };
    }
    return {
      success: false,
      abilities: [],
      error: `Text marked as complex but no manual entry found: "${normalizedText}"${options?.cardName ? ` (Card: ${options.cardName})` : ""}. Please add an entry to MANUAL_ENTRIES in manual-overrides.ts`,
    };
  }

  // Step 4: Fall back to single ability parsing
  const singleResult = parseAbilityText(text, options);

  if (singleResult.success && singleResult.ability) {
    return {
      success: true,
      abilities: [singleResult.ability],
      warnings: singleResult.warnings,
    };
  }

  return {
    success: false,
    abilities: [],
    error: singleResult.error || singleResult.warnings?.join(", "),
    warnings: singleResult.warnings,
  };
}
