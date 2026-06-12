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
  isParameterizedKeywordType,
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
  ConditionComparison,
  ConditionComparisonOperator,
  // Comparison conditions
  ComparisonCondition,
  ComparisonValue,
  Condition,
  CountableResource,
  // Count conditions
  CountCondition,
  DamageComparisonCondition,
  FirstTurnNonOtpCondition,
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
  // Action-effect structured conditions
  PlayContextCondition,
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
  RevealedIsCardTypeCondition,
  RevealedMatchesNamedCondition,
  TargetAggregateComparisonCondition,
  TargetAggregateOperand,
  TargetQueryCondition,
  TargetAggregateAttribute,
  TargetAggregateOp,
  // This-turn conditions
  ThisTurnCondition,
  ThisTurnCountCondition,
  ThisTurnEvent,
  ThisTurnHappenedCondition,
  // Turn conditions
  TurnCondition,
  TurnMetric,
  TurnMetricCondition,
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
  AdditionalInkwellEffect,
  AmountExpr,
  AmountRef,
  VariableAmountOperand,
  BanishEffect,
  ChoiceEffect,
  CountEffect,
  ConditionalEffect,
  CostReductionEffect,
  CreateReplacementEffect,
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
  ForEachOpponentEffect,
  // Keyword effects
  GainKeywordEffect,
  GainKeywordsEffect,
  // Lore effects
  GainLoreEffect,
  GrantAbilityEffect,
  LoseKeywordEffect,
  LoseLoreEffect,
  NumericSelfReplacement,
  // Stat modification effects
  ModifyStatEffect,
  MoveDamageEffect,
  MoveCardsFromUnderEffect,
  // Location movement effects
  MoveToLocationEffect,
  NameACardEffect,
  OrEffect,
  OptionalEffect,
  PayCostEffect,
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
  ReplacementAbilityKind,
  ReplacementEventKind,
  ReplacementRegistrationKind,
  ReplacementTargetReference,
  ReturnFromDiscardEffect,
  ReturnRandomFromInkwellEffect,
  // Zone movement effects
  ReturnToHandEffect,
  RevealAndRouteEffect,
  RevealRoute,
  RevealRouteDestination,
  RevealHandEffect,
  RevealInkwellEffect,
  RevealUntilMatchEffect,
  // Reveal effects
  RevealTopCardEffect,
  // Scry effect (look at top X cards)
  ScryCardFilter,
  ScryCardOrdering,
  ScryDeckBottomDestination,
  ScryDeckTopDestination,
  ScryDestination,
  ScryDiscardDestination,
  ScryEffect,
  ScryHandDestination,
  ScryInkwellDestination,
  ScryPlayDestination,
  // Search effects
  SearchDeckEffect,
  SelectTargetEffect,
  SelfPlayConditionEffect,
  SelfReplacementCondition,
  // Control flow effects
  SequenceEffect,
  StatFloorEffect,
  SetStatEffect,
  ShuffleIntoDeckEffect,
  StaticEffect,
  SupportEffect,
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
export type { MillEffect } from "./effect-types";
// Helpers
export {
  Abilities,
  Conditions,
  Costs,
  Effects,
  Targets,
  Triggers,
  getUpToRule,
  listUpToRuleEffectTypes,
  supportsUpTo,
} from "./helpers";
export type { UpToCapContext, UpToRule, UpToRuleParams } from "./helpers";
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
  NamedCardFilter,
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
