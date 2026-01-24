/**
 * Lorcana Ability Text Parser
 *
 * Public API for parsing Lorcana card ability text into type-safe Ability objects.
 *
 * Uses v2 parser - see ./v2/ for implementation.
 *
 * @example Basic usage
 * ```typescript
 * import { parseAbilityText } from "@tcg/lorcana/parser";
 *
 * const result = parseAbilityText("Rush");
 * if (result.success) {
 *   console.log(result.ability);
 * }
 * ```
 *
 * @example Batch processing
 * ```typescript
 * import { parseAbilityTexts } from "@tcg/lorcana/parser";
 *
 * const texts = ["Rush", "Ward", "Challenger +3"];
 * const results = parseAbilityTexts(texts);
 * console.log(`Parsed ${results.successful}/${results.total} abilities`);
 * ```
 *
 * @example Multi-ability parsing
 * ```typescript
 * import { parseAbilityTextMulti } from "@tcg/lorcana/parser";
 *
 * const result = parseAbilityTextMulti("ABILITY ONE Effect. ABILITY TWO Other.");
 * if (result.success) {
 *   console.log(`Found ${result.abilities.length} abilities`);
 * }
 * ```
 */

// ============================================================================
// V2 Parser Exports
// ============================================================================

export type { ClassificationResult } from "./v2/classifier";
// Classifier
export { classifyAbility } from "./v2/classifier";
// Main v2 parser class
export { LorcanaParserV2, parserV2 } from "./v2/index";
// Manual overrides
export {
  getManualEntry,
  MANUAL_ENTRIES,
  tooComplexText,
} from "./v2/manual-overrides";
// Numeric extractor utilities
export {
  extractNumericValues,
  normalizeToPattern,
} from "./v2/numeric-extractor";
export type { MultiParseResult } from "./v2/parser";
// Main parser functions
export {
  parseAbilityText,
  parseAbilityTextMulti,
  parseAbilityTexts,
} from "./v2/parser";
// Preprocessor utilities
export {
  extractNamedAbilityPrefix,
  normalizeText,
  resolveSymbols,
} from "./v2/preprocessor";

// Types
export type {
  AbilityWithText,
  BatchParseResult,
  ParseResult,
  ParserOptions,
} from "./v2/types";
