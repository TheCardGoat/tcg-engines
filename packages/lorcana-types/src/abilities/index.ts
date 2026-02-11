/**
 * Lorcana Ability Types
 *
 * Complete type system for Lorcana card abilities.
 */

// Ability Types
export type {
  // Main ability types
  Ability,
  AbilityWithText,
  ActionAbility,
  ActivatedAbility,
  ActivatedRestriction,
  ComplexKeywordType,
  // Keyword types
  KeywordAbility,
  KeywordType,
  ParameterizedKeywordAbility,
  ParameterizedKeywordType,
  ReplacementAbility,
  // Supporting types
  Restriction,
  ShiftKeywordAbility,
  SimpleKeywordAbility,
  SimpleKeywordType,
  StaticAbility,
  StaticAffects,
  // Other ability types
  TriggeredAbility,
  ValueKeywordAbility,
  ValueKeywordType,
} from "./ability-types";

export {
  actionAbility,
  activated,
  boost,
  challenger,
  isActionAbility,
  isActivatedAbility,
  isComplexKeyword,
  // Type guards
  isKeywordAbility,
  isNamedAbility,
  isParameterizedKeyword,
  isParameterizedKeywordAbility,
  isReplacementAbility,
  isShiftKeyword,
  isShiftKeywordAbility,
  isSimpleKeyword,
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

// Condition Types
export type {
  // Logical conditions
  AndCondition,
  AtLocationCondition,
  ClassificationCharacterCountCondition,
  // Comparison conditions
  ComparisonCondition,
  ComparisonValue,
  Condition,
  CountableResource,
  // Count conditions
  CountCondition,
  DamageComparisonCondition,
  FirstThisTurnCondition,
  HasAnyDamageCondition,
  HasCardUnderCondition,
  // Character existence conditions
  HasCharacterCondition,
  HasCharacterCountCondition,
  HasCharacterHereCondition,
  HasCharacterWithClassificationCondition,
  HasCharacterWithKeywordCondition,
  // Damage conditions
  HasDamageCondition,
  // Item existence conditions
  HasItemCondition,
  HasItemCountCondition,
  // Location conditions
  HasLocationCondition,
  HasLocationCountCondition,
  HasNamedCharacterCondition,
  HasNamedItemCondition,
  HasNamedLocationCondition,
  // Parser catch-all
  IfCondition,
  // Combat conditions
  InChallengeCondition,
  // Zone presence conditions
  InInkwellCondition,
  InPlayCondition,
  // State conditions
  IsExertedCondition,
  IsReadyCondition,
  KeywordCharacterCountCondition,
  NoDamageCondition,
  NotCondition,
  OrCondition,
  // Choice conditions
  PlayerChoiceCondition,
  // Legacy resolution (deprecated)
  ResolutionCondition,
  ResourceCountCondition,
  RevealedMatchesNamedCondition,
  // This-turn conditions
  ThisTurnCondition,
  ThisTurnCountCondition,
  ThisTurnEvent,
  ThisTurnHappenedCondition,
  // Turn conditions
  TurnCondition,
  // Game state conditions
  UsedShiftCondition,
  // Zone conditions
  ZoneCondition,
} from "./condition-types";

export {
  and,
  hasCharacterCount,
  // Condition builders
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

// Cost Types
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
  // Cost builders
  exertCost,
  getInkCost,
  isFreeCost,
  requiresBanish,
  requiresDiscard,
  // Type guards
  requiresExert,
  requiresInk,
} from "./cost-types";

// Effect Types
export type {
  // Amount types
  Amount,
  BanishEffect,
  ChoiceEffect,
  ConditionalEffect,
  CostReductionEffect,
  // Damage effects
  DealDamageEffect,
  DiscardEffect,
  // Draw/Discard effects
  DrawEffect,
  DrawUntilHandSizeEffect,
  // Core effect union types
  Effect,
  // Duration type
  EffectDuration,
  EnablePlayFromUnderEffect,
  // Special state modification effects
  EntersPlayEffect,
  // Card state effects
  ExertEffect,
  ForEachCounter,
  ForEachEffect,
  // Keyword effects
  GainKeywordEffect,
  // Lore effects
  GainLoreEffect,
  GrantAbilityEffect,
  LoseKeywordEffect,
  LoseLoreEffect,
  // Stat modification effects
  ModifyStatEffect,
  MoveDamageEffect,
  // Location movement effects
  MoveToLocationEffect,
  NameACardEffect,
  OptionalEffect,
  // Play card effects
  PlayCardEffect,
  PropertyModificationEffect,
  PutDamageEffect,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  PutOnTopEffect,
  PutUnderEffect,
  ReadyEffect,
  RemoveDamageEffect,
  RepeatEffect,
  // Restriction effects
  RestrictionEffect,
  ReturnFromDiscardEffect,
  // Zone movement effects
  ReturnToHandEffect,
  RevealHandEffect,
  // Reveal effects
  RevealTopCardEffect,
  // Scry effect (look at top X cards)
  ScryAndFilter,
  ScryCardFilter,
  ScryCardOrdering,
  ScryCardTypeFilter,
  ScryClassificationFilter,
  ScryCostComparisonFilter,
  ScryDeckBottomDestination,
  ScryDeckTopDestination,
  ScryDestination,
  ScryDiscardDestination,
  ScryEffect,
  ScryFloodbornFilter,
  ScryHandDestination,
  ScryInkwellDestination,
  ScryKeywordFilter,
  ScryNameFilter,
  ScryNotFilter,
  ScryOrFilter,
  ScryPlayDestination,
  ScrySongFilter,
  // Search effects
  SearchDeckEffect,
  // Control flow effects
  SequenceEffect,
  SetStatEffect,
  ShuffleIntoDeckEffect,
  StaticEffect,
  VariableAmount,
  WinConditionEffect,
} from "./effect-types";

export {
  // Type guards
  isControlFlowEffect,
  isScryDeckBottomDestination,
  isScryDeckTopDestination,
  isScryDiscardDestination,
  isScryEffect,
  isScryHandDestination,
  isScryInkwellDestination,
  isScryPlayDestination,
  isScryRemainderDestination,
  isVariableAmount,
  targetsCharacters,
} from "./effect-types";
// Helpers
export { Abilities, Conditions, Costs, Effects, Targets, Triggers } from "./helpers";
// Target Types
export type {
  AllMatchingCharacterQuery,
  AllMatchingItemQuery,
  AllMatchingLocationQuery,
  AttributeBooleanFilter,
  // Attribute filter
  AttributeFilter,
  AttributeNumericFilter,
  AttributeStringFilter,
  // Filters
  CardFilter,
  // Card references
  CardReference,
  // Card targeting
  CardTarget,
  CardTargetEnum,
  ChallengeRoleFilter,
  CharacterFilter,
  CharacterQueryBase,
  // Character targeting
  CharacterTarget,
  CharacterTargetEnum,
  CharacterTargetQuery,
  ComparisonOperator,
  // Numeric filters
  CostComparisonFilter,
  // State filters
  DamagedFilter,
  ExactCountCharacterQuery,
  ExactCountItemQuery,
  ExactCountLocationQuery,
  ExertedFilter,
  HasClassificationFilter,
  // Property filters
  HasKeywordFilter,
  HasNameFilter,
  ItemFilter,
  ItemQueryBase,
  // Item targeting
  ItemTarget,
  ItemTargetEnum,
  ItemTargetQuery,
  LocationFilter,
  LocationQueryBase,
  // Location targeting
  LocationTarget,
  LocationTargetEnum,
  LocationTargetQuery,
  // Context
  LorcanaContext,
  LoreComparisonFilter,
  MoveCostComparisonFilter,
  OwnerFilter,
  // Player targeting
  PlayerTarget,
  ReadyFilter,
  // Source filters
  SourceFilter,
  StrengthComparisonFilter,
  TargetController,
  // Zone/Controller types
  TargetZone,
  UndamagedFilter,
  UpToCountCharacterQuery,
  UpToCountItemQuery,
  UpToCountLocationQuery,
  WillpowerComparisonFilter,
  // Zone/Owner filters
  ZoneFilter,
} from "./target-types";
export {
  // Type guards
  isCardReference,
  isCharacterTargetQuery,
  isItemTargetQuery,
  isLocationTargetQuery,
} from "./target-types";
// Trigger Types
export type {
  BaseTrigger,
  ChallengeTrigger,
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
  // Common triggers
  COMMON_TRIGGERS,
  hasRestriction,
  // Type guards
  isChallengeTrigger,
  isPhaseTrigger,
  isSelfTrigger,
  isTriggerSubjectQuery,
} from "./trigger-types";
