// Action Text Parser Module
// This module provides functionality to parse action card text and generate corresponding abilities

// Ability Builder types
export type { AbilityBuilderConfig } from "./ability-builder";

// Ability Builder exports
export {
  buildAbilitiesFromClauses,
  buildAbilitiesWithGrouping,
  buildAbilitiesWithModalSupport,
  buildAbilitiesWithTriggeredSupport,
  buildDelayedTriggeredAbilityFromClause,
  buildFloatingTriggeredAbilityFromClause,
  buildModalAbilityFromClause,
  buildResolutionAbilityFromEffects,
  combineEffectsIntoSingleAbility,
  createDelayedTriggeredAbility,
  createFloatingTriggeredAbility,
  createModalEffect,
  createModalEffectMode,
  createResolutionAbility,
  createTriggerFromClause,
  detectDependentEffects,
  isDelayedTriggeredClause,
  isDetrimentalAbility,
  isFloatingTriggeredClause,
  isModalClause,
  parseModalOptions,
  parseTimingFromClause,
  shouldCombineClauses,
  shouldResolveEffectsIndividually,
} from "./ability-builder";
export {
  analyzeTextStructure,
  GAME_SYMBOLS,
  generateActionAbilitiesFromText,
  handleGameSymbols,
  identifyConditionalPhrases,
  identifyModalPatterns,
  identifyTimingMarkers,
  normalizeCase,
  normalizePunctuation,
  normalizeSpacing,
  normalizeText,
  parseActionText,
  splitIntoClauses,
  splitIntoSentences,
  validateTextFormat,
} from "./parser";
export type {
  EffectPattern,
  NormalizationConfig,
  ParsedClause,
  ParsedEffect,
  ParseResult,
  ParserConfig,
} from "./types";
