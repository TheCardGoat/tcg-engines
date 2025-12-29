/**
 * v2 Parser Type Definitions
 *
 * Re-exports types from @tcg/lorcana-types for use in the parser.
 * This allows the parser to work with proper types without depending
 * on the game engine.
 */

// Re-export all types from @tcg/lorcana-types
export type {
  // Ability types
  Ability,
  // Cost types
  AbilityCost,
  AbilityDefinition,
  ActionAbility,
  ActionCard,
  ActivatedAbility,
  AndCondition,
  BanishEffect,
  CardTarget,
  // Card types
  CardType,
  CharacterCard,
  CharacterFilter,
  // Target types
  CharacterTarget,
  CharacterTargetEnum,
  CharacterTargetQuery,
  ChoiceEffect,
  Classification,
  ComparisonCondition,
  // Condition types
  Condition,
  ConditionalEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  // Effect types
  Effect,
  ExertEffect,
  ForEachEffect,
  GainKeywordEffect,
  GainLoreEffect,
  HasCharacterCountCondition,
  HasCharacterWithClassificationCondition,
  HasNamedCharacterCondition,
  // Ink and classification
  InkType,
  ItemCard,
  ItemTarget,
  KeywordAbility,
  KeywordType,
  LocationCard,
  LocationTarget,
  LookAtCardsEffect,
  LookAtFollowUp,
  LorcanaCard,
  LorcanaCardDefinition,
  LoseLoreEffect,
  ModifyStatEffect,
  MoveToLocationEffect,
  OptionalEffect,
  OrCondition,
  ParameterizedKeywordType,
  PlayCardEffect,
  PlayerChoiceCondition,
  PlayerTarget,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  ReadyEffect,
  RepeatEffect,
  ReplacementAbility,
  ResourceCountCondition,
  Restriction,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  RevealHandEffect,
  RevealTopCardEffect,
  SearchDeckEffect,
  SequenceEffect,
  ShuffleIntoDeckEffect,
  SimpleKeywordType,
  StaticAbility,
  StaticEffect,
  ThisTurnHappenedCondition,
  // Trigger types
  Trigger,
  TriggerEvent,
  TriggeredAbility,
  TriggerSubject,
  TriggerTiming,
  ValueKeywordType,
} from "@tcg/lorcana-types";

// Re-export utility functions
export {
  actionAbility,
  activated,
  // Common triggers
  COMMON_TRIGGERS,
  challenger,
  exertAndInkCost,
  // Cost utilities
  exertCost,
  isActionAbility,
  isActionCard,
  isActivatedAbility,
  isCharacterCard,
  isItemCard,
  // Type guards
  isKeywordAbility,
  isLocationCard,
  isReplacementAbility,
  isStaticAbility,
  isTriggeredAbility,
  // Builders
  keyword,
  resist,
  shift,
  singer,
  staticAbility,
  triggered,
} from "@tcg/lorcana-types";
