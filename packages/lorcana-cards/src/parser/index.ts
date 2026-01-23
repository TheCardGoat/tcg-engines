/**
 * Lorcana Ability Text Parser
 *
 * Public API for parsing Lorcana card ability text into type-safe Ability objects.
 *
 * Now using v2 parser by default - see @tcg/lorcana/parser/v2 for implementation.
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
 */

// ============================================================================
// V2 PARSER EXPORTS (Primary)
// ============================================================================

// Main v2 parser class
export { LorcanaParserV2, parserV2 } from "./v2/index";

// Main parser functions (v2 compatibility wrappers)
export {
  parseAbilityText,
  parseAbilityTexts,
} from "./v2/parser";

// ============================================================================
// V1 PARSER EXPORTS (Deprecated - use v2)
// ============================================================================

export { classifyAbility } from "./classifier";
export type { MultiParseResult } from "./parser";
export { parseAbilityTextMulti } from "./parser";
export { parseActivatedAbility } from "./parsers/activated-parser";
export {
  extractConditionText,
  parseCondition,
} from "./parsers/condition-parser";
// Effect/Target/Condition parsers for advanced use
export { parseEffect } from "./parsers/effect-parser";
// Advanced use cases - individual parsers
export { parseKeywordAbility } from "./parsers/keyword-parser";
export { parseReplacementAbility } from "./parsers/replacement-parser";
export { parseStaticAbility } from "./parsers/static-parser";
export {
  parseCharacterTarget,
  parseItemTarget,
  parseLocationTarget,
  parsePlayerTarget,
} from "./parsers/target-parser";
export { parseTriggeredAbility } from "./parsers/triggered-parser";
// Utilities
export {
  extractNamedAbilityPrefix,
  normalizeText,
  resolveSymbols,
} from "./preprocessor";
// Types
export type {
  AbilityWithText,
  BatchParseResult,
  ClassificationResult,
  ParseResult,
  ParserOptions,
} from "./types";
