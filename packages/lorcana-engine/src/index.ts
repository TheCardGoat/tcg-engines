/**
 * @tcg/lorcana - Disney Lorcana TCG Engine
 *
 * A complete implementation of Disney Lorcana using the @tcg/core framework.
 * This package serves as both a production-ready Lorcana engine and a reference
 * implementation demonstrating best practices for building TCG engines.
 *
 * Key Concepts:
 * - NO defineMove(), defineZone(), definePhase(), defineCard() helpers
 * - Use GameDefinition<TState, TMoves> type directly
 * - Zones are simple state arrays: Record<PlayerId, CardId[]>
 * - Cards are plain objects in lookup tables
 * - Moves use GameMoveDefinitions with condition and reducer
 * - Flow is optional - use FlowDefinition or simple state tracking
 */

// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
} from "@tcg/core";
// Export card-utils
export {
  canInk,
  canQuest,
  getAllKeywords,
  getAmpersandNames,
  getLoreValue,
  getMoveCost,
  getShiftCost,
  getShiftTargetName,
  getStrength,
  getTotalKeyword,
  getWillpower,
  hasAmpersandName,
  hasBodyguard,
  hasEvasive,
  hasKeyword,
  hasReckless,
  hasRush,
  hasSameName,
  hasShift,
  hasVanish,
  hasWard,
  isAction,
  isCharacter,
  isItem,
  isLocation,
  isSong,
} from "./card-utils";
// Card/Ability type exports - explicit to avoid conflicts with types/keywords.ts
export {
  // Version and examples
  ABILITY_TYPES_VERSION,
  // Ability types (main)
  type Ability,
  // Cost types
  type AbilityCost,
  type AbilityWithText,
  type ActivatedAbility,
  type ActivatedRestriction, // @deprecated - use Restriction
  type Amount,
  activated,
  and,
  banishSelfCost,
  boost,
  type CardTarget,
  type CharacterTarget,
  // Effect types for composite effects
  type ChoiceEffect,
  COMMON_TRIGGERS,
  // Condition types
  type Condition,
  type CostComponent,
  challenger,
  discardCost,
  // Effect types
  type Effect,
  type EffectDuration,
  EXAMPLE_ABILITIES,
  exertAndBanishItemCost,
  exertAndInkCost,
  exertCost,
  type ForEachCounter,
  getInkCost,
  hasCharacterCount,
  hasCharacterNamed,
  hasRestriction,
  type InChallengeCondition,
  type ItemTarget,
  ifUsedShift,
  inChallenge,
  isActivatedAbility,
  isCharacterTargetQuery,
  isControlFlowEffect,
  isCountCondition,
  isFreeCost,
  isItemTargetQuery,
  // Note: KeywordType, SimpleKeywordType, ParameterizedKeywordType, ValueKeywordType, ComplexKeywordType
  // and isSimpleKeyword, isParameterizedKeyword, isValueKeyword, isShiftKeyword, isComplexKeyword
  // are exported from ./types/keywords.ts
  isKeywordAbility,
  isLocationTargetQuery,
  isLogicalCondition,
  isNamedAbility,
  isParameterizedKeywordAbility,
  isPhaseTrigger,
  isPlayerChoice,
  isReplacementAbility,
  isSelfTrigger,
  isShiftKeywordAbility,
  // Keyword ability type guards
  isSimpleKeywordAbility,
  isStaticAbility,
  isTriggeredAbility,
  isTriggerSubjectQuery,
  isValueKeywordAbility,
  isVariableAmount,
  type KeywordAbility,
  // Builders
  keyword,
  type LocationTarget,
  // Composite effect types
  type OptionalEffect,
  or,
  type ParameterizedKeywordAbility,
  // Target types
  type PlayerTarget,
  type ReplacementAbility,
  type Restriction,
  requiresBanish,
  requiresDiscard,
  requiresExert,
  requiresInk,
  resist,
  // Composite effect types
  type SequenceEffect,
  type ShiftKeywordAbility,
  // Strict keyword ability variants
  type SimpleKeywordAbility,
  type SimpleKeywordType,
  type StaticAbility,
  type StaticAffects,
  type StaticEffect,
  shift,
  shiftInk,
  singer,
  singTogether,
  staticAbility,
  type TargetController,
  type TargetZone,
  // Trigger types
  type Trigger,
  type TriggerCardType,
  type TriggerEvent,
  type TriggeredAbility,
  type TriggerRestriction,
  type TriggerSubject,
  type TriggerSubjectEnum,
  type TriggerSubjectQuery,
  type TriggerTiming,
  targetsCharacters,
  triggered,
  type ValueKeywordAbility,
  type VariableAmount,
  whileHasDamage,
  whileNoDamage,
  youMay,
} from "./cards";
// Spec 1: Foundation & Types
export * from "./deck-validation";
// Engine exports
export { LorcanaEngine } from "./engine/lorcana-engine";
// Targeting DSL
export * from "./targeting";
// Type exports
export * from "./types";
// Move enumeration type exports
export type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "./types/move-enumeration";
