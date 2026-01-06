/**
 * Lorcana Engine Condition Types
 *
 * Re-exports all Condition types from @tcg/lorcana-types.
 * @tcg/lorcana-types is the single source of truth for condition definitions.
 *
 * Engine-specific condition resolvers are registered in /src/resolvers/conditions/
 */

// Re-export all condition types from lorcana-types
export type {
  AndCondition,
  AtLocationCondition,
  ClassificationCharacterCountCondition,
  ComparisonCondition,
  ComparisonValue,
  Condition,
  CountableResource,
  CountCondition,
  DamageComparisonCondition,
  FirstThisTurnCondition,
  HasAnyDamageCondition,
  HasCardUnderCondition,
  HasCharacterCondition,
  HasCharacterCountCondition,
  HasCharacterHereCondition,
  HasCharacterWithClassificationCondition,
  HasCharacterWithKeywordCondition,
  HasDamageCondition,
  HasItemCondition,
  HasItemCountCondition,
  HasLocationCondition,
  HasLocationCountCondition,
  HasNamedCharacterCondition,
  HasNamedItemCondition,
  HasNamedLocationCondition,
  IfCondition,
  InChallengeCondition,
  InInkwellCondition,
  InPlayCondition,
  IsExertedCondition,
  IsReadyCondition,
  KeywordCharacterCountCondition,
  NoDamageCondition,
  NotCondition,
  OrCondition,
  PlayerChoiceCondition,
  ResolutionCondition,
  ResourceCountCondition,
  RevealedMatchesNamedCondition,
  ThisTurnCondition,
  ThisTurnCountCondition,
  ThisTurnEvent,
  ThisTurnHappenedCondition,
  TurnCondition,
  UsedShiftCondition,
  ZoneCondition,
} from "@tcg/lorcana-types/abilities";

// Re-export condition builder functions
export {
  and,
  hasCharacterCount,
  hasCharacterNamed,
  hasCharacterWithClassification,
  hasCharacterWithKeyword,
  ifUsedShift,
  inChallenge,
  isCountCondition,
  isLogicalCondition,
  isPlayerChoice,
  or,
  resourceCount,
  thisTurnHappened,
  whileHasDamage,
  whileNoDamage,
  youMay,
} from "@tcg/lorcana-types/abilities";
