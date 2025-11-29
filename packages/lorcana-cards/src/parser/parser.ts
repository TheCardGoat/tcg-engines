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
import { parseActionAbility } from "./parsers/action-parser";
import { parseActivatedAbility } from "./parsers/activated-parser";
import { parseKeywordAbility } from "./parsers/keyword-parser";
import { parseStaticAbility } from "./parsers/static-parser";
import { parseTriggeredAbility } from "./parsers/triggered-parser";
import { normalizeText } from "./preprocessor";
import type { BatchParseResult, ParseResult, ParserOptions } from "./types";

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
