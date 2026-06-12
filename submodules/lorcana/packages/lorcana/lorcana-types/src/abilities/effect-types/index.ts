/**
 * Effect Types Index
 *
 * Re-exports all effect types and type guards from sub-modules.
 * Import from this file for all effect-related types.
 */

// Shared types
export type {
  AmountExpr,
  AmountRef,
  EffectDuration,
  ForEachCounterType,
  VariableAmount,
  VariableAmountOperand,
} from "../../expressions";
export { isVariableAmount } from "../../expressions";

// Basic effects
export type {
  BanishEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  ExertEffect,
  GainLoreEffect,
  LoseLoreEffect,
  LookAtCardsEffect,
  MillEffect,
  MoveDamageEffect,
  NumericSelfReplacement,
  PutDamageEffect,
  PutInHandEffect,
  ReadyEffect,
  RemoveDamageEffect,
  SelectTargetEffect,
  SelfReplacementCondition,
} from "./basic-effects";
// Combined types and guards
export type {
  AdditionalInkwellEffect,
  ChallengeReadyEffect,
  CountEffect,
  Effect,
  EntersPlayWithEffect,
  GainKeywordsEffect,
  PayCostEffect,
  ReplacementEffect,
  StaticEffect,
  SupportEffect,
} from "./combined-types";
export { isControlFlowEffect, isScryEffect, targetsCharacters } from "./combined-types";
// Control flow effects
export type {
  ChoiceEffect,
  CompoundEffect,
  ConditionalEffect,
  CreateReplacementEffect,
  ReplacementAbilityKind,
  ReplacementEventKind,
  ReplacementRegistrationKind,
  ReplacementTargetReference,
  CreateTriggeredAbilityEffect,
  CostEffectEffect,
  ForEachCounter,
  ForEachEffect,
  ForEachOpponentEffect,
  ForEachPlayerEffect,
  GainAbilityEffect,
  GrantKeywordEffect,
  GrantKeywordsEffect,
  LookEffect,
  OrEffect,
  OptionalEffect,
  PlayForFreeEffect,
  PreventDamageEffect,
  PutIntoHandEffect,
  PutOnDeckEffect,
  RedirectDamageEffect,
  RepeatEffect,
  RevealAndConditionalEffect,
  RevealAndRouteEffect,
  RevealRoute,
  RevealRouteDestination,
  SequenceEffect,
} from "./control-flow";

// Modifier effects
export type {
  CostIncreaseEffect,
  CostReductionEffect,
  DamageSourceStatOverrideEffect,
  DrawUntilHandSizeEffect,
  EntersPlayEffect,
  GainKeywordEffect,
  GrantAbilityEffect,
  LoseKeywordEffect,
  GrantHandInkabilityEffect,
  GrantDiscardInkabilityEffect,
  ModifyStatEffect,
  NameACardEffect,
  PropertyModificationEffect,
  PutOnTopEffect,
  RevealUntilMatchEffect,
  RestrictionEffect,
  RevealHandEffect,
  RevealInkwellEffect,
  RevealTopCardEffect,
  SearchDeckEffect,
  SelfPlayConditionEffect,
  StatFloorEffect,
  SetStatEffect,
  WinConditionEffect,
} from "./modifier-effects";
// Movement effects
export type {
  EnablePlayFromUnderEffect,
  GrantAbilitiesWhileHereEffect,
  MoveCostReductionEffect,
  MoveCardsFromUnderEffect,
  MoveToLocationEffect,
  PlayCardEffect,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  PutUnderEffect,
  ReturnRandomFromInkwellEffect,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  ShuffleIntoDeckEffect,
} from "./movement-effects";
// Scry effects
export type {
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
