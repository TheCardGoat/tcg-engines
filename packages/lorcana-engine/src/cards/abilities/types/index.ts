/**
 * Ability Types Index
 *
 * Re-exports all ability-related types for convenient importing.
 *
 * @example
 * ```typescript
 * import {
 *   Ability,
 *   Effect,
 *   Trigger,
 *   Condition,
 *   CharacterTarget,
 * } from "./types";
 * ```
 */

// ============================================================================
// Ability Types (main entry point)
// ============================================================================

export type {
  // Main ability union
  Ability,
  AbilityWithText,
  ActivatedAbility,
  ActivatedRestriction, // @deprecated alias
  ComplexKeywordType, // @deprecated
  // Individual ability types
  KeywordAbility,
  // Keyword types
  KeywordType,
  ParameterizedKeywordAbility,
  ParameterizedKeywordType,
  ReplacementAbility,
  // Restriction type (unified DSL for ability/trigger restrictions)
  Restriction,
  ShiftKeywordAbility,
  // Strict keyword ability variants
  SimpleKeywordAbility,
  SimpleKeywordType,
  StaticAbility,
  // Other types
  StaticAffects,
  TriggeredAbility,
  ValueKeywordAbility,
  ValueKeywordType,
} from "./ability-types";

export {
  activated,
  boost,
  challenger,
  isActivatedAbility,
  isComplexKeyword, // @deprecated
  // Type guards for abilities
  isKeywordAbility,
  isNamedAbility,
  isParameterizedKeyword,
  isParameterizedKeywordAbility,
  isReplacementAbility,
  isShiftKeyword,
  isShiftKeywordAbility,
  // Type guards for keyword types
  isSimpleKeyword,
  // Type guards for keyword abilities
  isSimpleKeywordAbility,
  isStaticAbility,
  isTriggeredAbility,
  isValueKeyword,
  isValueKeywordAbility,
  // Builders
  keyword,
  resist,
  shift,
  shiftInk,
  singer,
  singTogether,
  staticAbility,
  triggered,
} from "./ability-types";

// ============================================================================
// Effect Types
// ============================================================================

export type {
  // Amount types
  Amount,
  BanishEffect,
  CardTypeFilter,
  ChoiceEffect,
  ConditionalEffect,
  DealDamageEffect,
  DiscardEffect,
  // Individual effect types
  DrawEffect,
  // Main effect union
  Effect,
  EffectDuration,
  ExertEffect,
  ForEachCounter,
  ForEachEffect,
  GainKeywordEffect,
  GainLoreEffect,
  GrantAbilityEffect,
  LookAtCardsEffect,
  LookAtFollowUp,
  LoseKeywordEffect,
  LoseLoreEffect,
  ModifyStatEffect,
  MoveDamageEffect,
  MoveToLocationEffect,
  OptionalEffect,
  PlayCardEffect,
  PutDamageEffect,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  PutUnderEffect,
  ReadyEffect,
  RemoveDamageEffect,
  RepeatEffect,
  RestrictionEffect,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  RevealHandEffect,
  SearchDeckEffect,
  SequenceEffect,
  SetStatEffect,
  ShuffleIntoDeckEffect,
  StaticEffect,
  VariableAmount,
} from "./effect-types";

export {
  isControlFlowEffect,
  isVariableAmount,
  targetsCharacters,
} from "./effect-types";

// ============================================================================
// Trigger Types
// ============================================================================

export type {
  ChallengeTrigger,
  // Challenge trigger extensions
  ChallengeTriggerContext,
  Trigger,
  TriggerCardType,
  TriggerEvent,
  TriggerRestriction,
  TriggerSourceReference,
  TriggerSubject,
  TriggerSubjectEnum,
  TriggerSubjectQuery,
  TriggerTiming,
} from "./trigger-types";

export {
  COMMON_TRIGGERS,
  hasRestriction,
  isChallengeTrigger,
  isPhaseTrigger,
  isSelfTrigger,
  isTriggerSubjectQuery,
} from "./trigger-types";

// ============================================================================
// Target Types
// ============================================================================

export type {
  AllMatchingCharacterQuery,
  AllMatchingItemQuery,
  AllMatchingLocationQuery,
  AttributeBooleanFilter,
  // NEW: Generic attribute filters
  AttributeFilter,
  AttributeNumericFilter,
  AttributeStringFilter,
  // Unified filter type (all filters)
  CardFilter,
  // Card References (context-aware)
  CardReference,
  // Card targeting (any type)
  CardTarget,
  CardTargetEnum,
  ChallengeRoleFilter,
  CharacterFilter,
  // Character targeting
  CharacterTarget,
  CharacterTargetEnum,
  CharacterTargetQuery,
  ComparisonOperator,
  CostComparisonFilter,
  // Individual filter types (shared across card types)
  DamagedFilter,
  // Strict character query variants
  ExactCountCharacterQuery,
  // Strict item query variants
  ExactCountItemQuery,
  // Strict location query variants
  ExactCountLocationQuery,
  ExertedFilter,
  HasClassificationFilter,
  HasKeywordFilter,
  HasNameFilter,
  ItemFilter,
  // Item targeting
  ItemTarget,
  ItemTargetEnum,
  ItemTargetQuery,
  LocationFilter,
  // Location targeting
  LocationTarget,
  LocationTargetEnum,
  LocationTargetQuery,
  LoreComparisonFilter,
  MoveCostComparisonFilter,
  OwnerFilter,
  // Player targeting
  PlayerTarget,
  ReadyFilter,
  // NEW: Source/Reference filters
  SourceFilter,
  StrengthComparisonFilter,
  TargetController,
  // Common types
  TargetZone,
  UndamagedFilter,
  UpToCountCharacterQuery,
  UpToCountItemQuery,
  UpToCountLocationQuery,
  WillpowerComparisonFilter,
  // NEW: Zone/Owner filters
  ZoneFilter,
} from "./target-types";

export {
  isCardReference,
  isCharacterTargetQuery,
  isItemTargetQuery,
  isLocationTargetQuery,
} from "./target-types";

// ============================================================================
// Cost Types
// ============================================================================

export type {
  AbilityCost,
  BanishCost,
  CostComponent,
  DamageSelfCost,
  DiscardCost,
  ExertCost,
  ExertOtherCost,
  InkCost,
  PutUnderCost,
  ReturnToHandCost,
} from "./cost-types";

export {
  banishSelfCost,
  discardCost,
  exertAndBanishItemCost,
  exertAndInkCost,
  // Builders
  exertCost,
  getInkCost,
  isFreeCost,
  requiresBanish,
  requiresDiscard,
  // Type guards
  requiresExert,
  requiresInk,
} from "./cost-types";

// ============================================================================
// Condition Types
// ============================================================================

export type {
  // Logical
  AndCondition,
  // Location state
  AtLocationCondition,
  ClassificationCharacterCountCondition,
  // Comparison
  ComparisonCondition,
  ComparisonValue,
  Condition,
  CountableResource,
  // Count conditions (strict variants)
  CountCondition,
  DamageComparisonCondition,
  FirstThisTurnCondition,
  HasAnyDamageCondition,
  HasCardUnderCondition,
  // Character existence conditions (strict variants)
  HasCharacterCondition,
  HasCharacterCountCondition,
  HasCharacterWithClassificationCondition,
  HasCharacterWithKeywordCondition,
  // Damage conditions (strict variants)
  HasDamageCondition,
  // Item existence conditions (strict variants)
  HasItemCondition,
  HasItemCountCondition,
  // Location existence conditions (strict variants)
  HasLocationCondition,
  HasLocationCountCondition,
  HasNamedCharacterCondition,
  HasNamedItemCondition,
  HasNamedLocationCondition,
  // Combat Context
  InChallengeCondition,
  // Card state
  IsExertedCondition,
  IsReadyCondition,
  KeywordCharacterCountCondition,
  NoDamageCondition,
  NotCondition,
  OrCondition,
  // Choice
  PlayerChoiceCondition,
  ResourceCountCondition,
  // This-turn conditions (strict variants)
  ThisTurnCondition,
  ThisTurnCountCondition,
  ThisTurnEvent,
  ThisTurnHappenedCondition,
  // Turn
  TurnCondition,
  // Game state
  UsedShiftCondition,
  // Zone
  ZoneCondition,
} from "./condition-types";

export {
  and,
  hasCharacterCount,
  // Builders
  hasCharacterNamed,
  hasCharacterWithClassification,
  hasCharacterWithKeyword,
  ifUsedShift,
  inChallenge,
  isCountCondition,
  // Type guards
  isLogicalCondition,
  isPlayerChoice,
  or,
  resourceCount,
  thisTurnHappened,
  whileHasDamage,
  whileNoDamage,
  youMay,
} from "./condition-types";
