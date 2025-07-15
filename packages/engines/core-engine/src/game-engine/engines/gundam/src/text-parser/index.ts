// Gundam Text Parser Module
// Exports the main components of the parser

// Import parseGundamText directly to use in the testParser function
import { parseGundamText } from "./parser";

// Ability builder exports
export {
  buildAbilitiesFromClauses,
  buildKeywordAbility,
  buildModalAbilityFromClause,
  buildResolutionAbilityFromEffects,
  buildTriggeredAbilityFromClause,
  createResolutionAbility,
  createTriggeredAbility,
  detectDependentEffects,
  isKeywordContinuous,
  shouldResolveEffectsIndividually,
} from "./ability-builder";
// Effect factory exports
export {
  createCompoundEffect,
  createConditionalEffect,
  createCostEffect,
  createDamageEffect,
  createDeployEffect,
  createDestroyEffect,
  createDrawEffect,
  createEffectFromParsed,
  createEffectsFromParsed,
  createKeywordEffect,
  createModalEffect,
  createPowerEffect,
  createSearchEffect,
  createTimingEffect,
} from "./effect-factory";
// Parser core exports
export {
  analyzeTextStructure,
  GUNDAM_SYMBOLS,
  generateAbilitiesFromText,
  handleGameSymbols,
  identifyConditionalPhrases,
  identifyModalPatterns,
  identifyTimingMarkers,
  normalizePunctuation,
  normalizeSpacing,
  normalizeText,
  parseGundamText,
  splitIntoSentences,
} from "./parser";
// Pattern system exports
export {
  addPattern,
  extractEffectsFromText,
  extractKeywordEffects,
  GUNDAM_EFFECT_PATTERNS,
  GUNDAM_KEYWORDS,
  getAvailableEffectTypes,
  getPatternsForEffectType,
  hasKeywordEffects,
  matchPattern,
  normalizeKeywords,
} from "./patterns";
// Target mapper exports
export {
  combineTargets,
  createCustomPlayerTarget,
  createCustomUnitTarget,
  createCustomZoneTarget,
  GUNDAM_TARGET_PATTERNS,
  getFilterValue,
  getTargetZone,
  hasFilter,
  isMultiTarget,
  parseTargetFromText,
  validateTarget,
} from "./target-mapper";
// Type exports
export * from "./types";

/**
 * Version of the Gundam Text Parser
 */
export const VERSION = "0.1.0";

/**
 * Simple utility to test the parser with a card text
 */
export function testParser(cardText: string, debug = false): any {
  console.log(`[Gundam Parser Test] Parsing: "${cardText}"`);

  const result = parseGundamText(cardText, { debug });

  console.log(
    `[Gundam Parser Test] Generated ${result.abilities.length} abilities`,
  );
  console.log(`[Gundam Parser Test] Warnings: ${result.warnings.length}`);
  console.log(`[Gundam Parser Test] Errors: ${result.errors.length}`);

  if (debug) {
    console.log(
      "[Gundam Parser Test] Result:",
      JSON.stringify(result, null, 2),
    );
  }

  return result;
}
