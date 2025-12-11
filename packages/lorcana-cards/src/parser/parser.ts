/**
 * Main Parser Orchestration
 *
 * Entry point for parsing ability text. Orchestrates the parsing pipeline:
 * 1. Preprocess text
 * 2. Classify ability type
 * 3. Route to specialized parser
 * 4. Validate and wrap result
 */

import { classifyAbility } from "./classifier";
import { getManualEntries, tooComplexText } from "./manual-overrides";
import { parseActionAbility } from "./parsers/action-parser";
import { parseActivatedAbility } from "./parsers/activated-parser";
import { parseKeywordAbility } from "./parsers/keyword-parser";
import { parseStaticAbility } from "./parsers/static-parser";
import { parseTriggeredAbility } from "./parsers/triggered-parser";
import { normalizeText } from "./preprocessor";
import type {
  AbilityWithText,
  BatchParseResult,
  ParseResult,
  ParserOptions,
} from "./types";

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
 * Parse a single ability text string into a type-safe Ability object
 *
 * @param text - Raw ability text from card
 * @param options - Parser options
 * @returns Parse result with success indicator and parsed ability or error
 *
 * @example
 * ```typescript
 * const result = parseAbilityText("Rush");
 * if (result.success) {
 *   console.log(result.ability);
 * }
 * ```
 */
export function parseAbilityText(
  text: string,
  options?: ParserOptions,
): ParseResult {
  // Step 1: Preprocess text
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  // Step 1.5: Check for manual override (complex texts that bypass parsing)
  const cardName = options?.cardName;
  if (tooComplexText(normalizedText, cardName)) {
    const manualEntries = getManualEntries(normalizedText, cardName);
    if (manualEntries && manualEntries.length > 0) {
      // Return the first ability for single-parse compatibility
      // Use parseAbilityTextMulti for full multi-ability support
      return {
        success: true,
        ability: manualEntries[0],
      };
    }
    return {
      success: false,
      error: `Text marked as complex but no manual entry found: "${normalizedText}"${cardName ? ` (Card: ${cardName})` : ""}. Please add an entry to MANUAL_ENTRIES in manual-overrides.ts`,
    };
  }

  // Step 2: Classify ability type
  const classification = classifyAbility(normalizedText);

  // Step 3: Route to specialized parser based on classification
  let result: ParseResult;

  switch (classification.type) {
    case "keyword":
      result = parseKeywordAbility(normalizedText);
      break;

    case "triggered":
      result = parseTriggeredAbility(normalizedText);
      break;

    case "activated":
      result = parseActivatedAbility(normalizedText);
      break;

    case "action":
      result = parseActionAbility(normalizedText);
      break;

    case "static":
      result = parseStaticAbility(normalizedText);
      break;

    case "replacement":
      // Replacement abilities not fully implemented yet
      result = {
        success: false,
        error: "Replacement abilities not yet fully implemented",
        unparsedSegments: [normalizedText],
      };
      break;

    case "unknown":
    default:
      result = {
        success: false,
        error: `Could not classify ability type for: "${normalizedText}"`,
        unparsedSegments: [normalizedText],
      };
      break;
  }

  // Step 4: Handle strict mode
  if (options?.strict && (result.warnings?.length || !result.success)) {
    return {
      success: false,
      error:
        result.error ||
        `Warnings in strict mode: ${result.warnings?.join(", ")}`,
      warnings: result.warnings,
    };
  }

  return result;
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
  options?: ParserOptions,
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

  // Step 2: Check for manual override (complex texts that bypass parsing)
  const cardName = options?.cardName;
  if (tooComplexText(normalizedText, cardName)) {
    const manualEntries = getManualEntries(normalizedText, cardName);
    if (manualEntries && manualEntries.length > 0) {
      return {
        success: true,
        abilities: manualEntries,
      };
    }
    return {
      success: false,
      abilities: [],
      error: `Text marked as complex but no manual entry found: "${normalizedText}"${cardName ? ` (Card: ${cardName})` : ""}. Please add an entry to MANUAL_ENTRIES in manual-overrides.ts`,
    };
  }

  // Step 3: Fall back to single ability parsing
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
    error: singleResult.error,
    warnings: singleResult.warnings,
  };
}

/**
 * Parse multiple ability text strings in batch
 *
 * Continues processing even if individual texts fail (lenient mode).
 * Returns aggregated results with success/failure counts.
 *
 * @param texts - Array of ability texts
 * @param options - Parser options
 * @returns Batch result with counts and individual results
 *
 * @example
 * ```typescript
 * const results = parseAbilityTexts(["Rush", "Challenger +3", "Ward"]);
 * console.log(`Parsed ${results.successful}/${results.total}`);
 * ```
 */
export function parseAbilityTexts(
  texts: string[],
  options?: ParserOptions,
): BatchParseResult {
  const results = texts.map((text) => parseAbilityText(text, options));

  const successful = results.filter((r) => r.success).length;
  const failed = results.length - successful;

  return {
    total: texts.length,
    successful,
    failed,
    results,
  };
}
