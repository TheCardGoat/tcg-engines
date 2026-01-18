/**
 * Effect Types Index
 *
 * Re-exports all effect types and type guards from sub-modules.
 * Import from this file for all effect-related types.
 */

// Shared types
export type { Amount, EffectDuration, VariableAmount } from "./amount-types";
export { isVariableAmount } from "./amount-types";

// Basic effects
export type {
  BanishEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  ExertEffect,
  GainLoreEffect,
  LoseLoreEffect,
  MoveDamageEffect,
  PutDamageEffect,
  ReadyEffect,
  RemoveDamageEffect,
} from "./basic-effects";
// Combined types and guards
export type { Effect, StaticEffect } from "./combined-types";
export {
  isControlFlowEffect,
  isScryEffect,
  targetsCharacters,
} from "./combined-types";
// Control flow effects
export type {
  ChoiceEffect,
  ConditionalEffect,
  ForEachCounter,
  ForEachEffect,
  OptionalEffect,
  RepeatEffect,
  SequenceEffect,
} from "./control-flow";

// Modifier effects
export type {
  CostReductionEffect,
  DrawUntilHandSizeEffect,
  EntersPlayEffect,
  GainKeywordEffect,
  GrantAbilityEffect,
  LoseKeywordEffect,
  ModifyStatEffect,
  NameACardEffect,
  PropertyModificationEffect,
  PutOnTopEffect,
  RestrictionEffect,
  RevealHandEffect,
  RevealTopCardEffect,
  SearchDeckEffect,
  SetStatEffect,
  WinConditionEffect,
} from "./modifier-effects";
// Movement effects
export type {
  EnablePlayFromUnderEffect,
  MoveCardsEffect,
  MoveToLocationEffect,
  PlayCardEffect,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  PutUnderEffect,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  ShuffleIntoDeckEffect,
} from "./movement-effects";
// Scry effects
export type {
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
} from "./scry-effects";
export {
  isScryDeckBottomDestination,
  isScryDeckTopDestination,
  isScryDiscardDestination,
  isScryHandDestination,
  isScryInkwellDestination,
  isScryPlayDestination,
  isScryRemainderDestination,
} from "./scry-effects";
