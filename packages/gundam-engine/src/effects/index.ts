/**
 * Gundam Effect System
 *
 * Comprehensive effect system for the Gundam Card Game.
 * Provides type definitions and execution for all game effects.
 *
 * @example Creating a simple effect
 * ```typescript
 * import { draw, damage, sequence } from "@tcg/gundam/effects";
 *
 * const abilityEffect = sequence(
 *   draw(1),
 *   damage(2, "each-opponent-unit")
 * );
 * ```
 *
 * @example Executing an effect
 * ```typescript
 * import { executeEffect, createEffectContext } from "@tcg/gundam/effects";
 *
 * const context = createEffectContext(gameState, playerId, cardId);
 * const result = executeEffect(abilityEffect, context);
 *
 * if (result.success) {
 *   // Apply result.state
 * }
 * ```
 */

// ============================================================================
// SHARED TYPES FROM @tcg/gundam-types/effects
// ============================================================================

import type {
  ActionTiming,
  ActivateAction,
  ActivateActionTiming,
  ActivateMainTiming,
  AttackTiming,
  BurstTiming,
  CardFilter,
  // Card Types
  CardType,
  Color,
  DamageAction,
  DeployTiming,
  DestroyAction,
  DestroyedTiming,
  DiscardAction,
  DrawAction,
  // Effect Definition (renamed to Effect for consistency)
  Effect,
  // Effect Actions
  EffectAction,
  // Effect Categories
  EffectCategory,
  // Effect Timing
  EffectTiming,
  EndOfTurnTiming,
  GrantKeywordAction,
  // Keywords
  KeywordEffect,
  // Filters
  LevelFilter,
  // Timing types
  MainTiming,
  ModifyStatsAction,
  MoveCardAction,
  RestAction,
  SearchAction,
  StartOfTurnTiming,
  TargetCountRange,
  TargetFilter,
  // Targeting
  TargetingSpec,
  TargetPropertyFilter,
  TargetStateFilter,
  // Zones
  ZoneType,
} from "@tcg/gundam-types/effects";

// ============================================================================
// RUNTIME TYPES FROM LOCAL MODULE
// ============================================================================

import type {
  // Effect Stack
  EffectInstance,
  EffectStackState,
  EndOfCombatModifier,
  EndOfTurnModifier,
  ModifierId,
  PermanentModifier,
  // Modifiers
  TemporaryModifier,
  WhileConditionModifier,
} from "./effect-runtime";

export type {
  // Re-export shared types from @tcg/gundam-types/effects
  EffectCategory,
  EffectTiming,
  Effect,
  // @deprecated Use `Effect` instead. This alias is kept for backward compatibility.
  Effect as EffectDefinition,
  EffectAction,
  DrawAction,
  DamageAction,
  RestAction,
  ActivateAction,
  MoveCardAction,
  SearchAction,
  ModifyStatsAction,
  GrantKeywordAction,
  DestroyAction,
  DiscardAction,
  TargetingSpec,
  TargetFilter,
  TargetCountRange,
  TargetStateFilter,
  TargetPropertyFilter,
  CardFilter,
  KeywordEffect,
  ZoneType,
  CardType,
  Color,
  // Re-export runtime types from effect-runtime
  TemporaryModifier,
  EndOfTurnModifier,
  EndOfCombatModifier,
  PermanentModifier,
  WhileConditionModifier,
  ModifierId,
  EffectInstance,
  EffectStackState,
};

// Ability system
export {
  type ActivatedAbility,
  applyStaticModifiers,
  type CardAbility,
  canActivateAbility,
  clearAbilities,
  createActivatedAbility,
  createStaticAbility,
  createTriggeredAbility,
  executeActivatedAbility,
  executeTriggeredAbility,
  findMatchingAbilities,
  getAbilities,
  getActivatableAbilities,
  getStaticAbilities,
  payCost,
  processTriggerEvents,
  registerAbilities,
  type StaticAbility,
  type TriggeredAbility,
  type TriggerType,
} from "./ability-system";

// Action handlers
export {
  type ActionContext,
  type ActionHandler,
  type CardDefinition,
  clearCardDefinitions,
  createModifierId,
  executeAction,
  executeActions,
  findCardZone,
  getCardDamage,
  getCardDefinition,
  getCardHP,
  getOpponentPlayer,
  handleActivateAction,
  handleDamageAction,
  handleDestroyAction,
  handleDiscardAction,
  handleDrawAction,
  handleGrantKeywordAction,
  handleModifyStatsAction,
  handleMoveCardAction,
  handleRestAction,
  handleSearchAction,
  hasLethalDamage,
  registerCardDefinition,
  resetModifierCounter,
  resolvePlayerRef,
  resolveSimpleTarget,
  setCardDamage,
} from "./action-handlers";

// Effect execution
export {
  createEffectContext,
  type EffectEvent,
  type EffectResult,
  type EventType,
  executeEffect,
  type PendingChoice,
  type ResolvedTarget,
} from "./effect-executor";

// Effect stack management
export {
  clearEffects,
  createEffectStack,
  dequeueEffect,
  enqueueBatchEffects,
  enqueueEffect,
  findEffectInstance,
  getEffect,
  getEffectStackCount,
  isEffectStackEmpty,
  markEffectFizzled,
  markEffectResolved,
  markEffectResolving,
  peekNextEffect,
  registerEffect,
  updateEffectInstance,
} from "./effect-stack";

// Builder functions from effect-types (engine-specific implementations)
// Type guards
export {
  addResources,
  addShield,
  attachAsPilot,
  battle,
  breakShield,
  changeController,
  choice,
  choiceOption,
  conditional,
  copy,
  counter,
  createToken,
  damage,
  destroy,
  discard,
  doTimes,
  draw,
  flip,
  forEach,
  gainAbility,
  gainControl,
  grantKeyword,
  heal,
  ifYouDo,
  isAmountExpression,
  isCombatEffect,
  isControlFlowEffect,
  isStatModifyingEffect,
  look,
  loseAbility,
  loseKeyword,
  modifyAP,
  modifyHP,
  optional,
  pairPilot,
  playFrom,
  playResource,
  preventDamage,
  redirectDamage,
  removeFromGame,
  repeatWhile,
  rest,
  restForResource,
  returnToHand,
  reveal,
  searchDeck,
  searchPilot,
  sendToTrash,
  sequence,
  setAP,
  setHP,
  shuffle,
  stand,
  swapStats,
  unpairPilot,
  untilEndOfTurn,
} from "./effect-types";

// New targeting system (for TargetingSpec/TargetFilter)
export {
  enumerateValidTargets,
  filterCardsByZone,
  // Utilities
  getAllCardsInGame,
  getCardDamage as getTargetingCardDamage,
  getCardOwner,
  getCardsInZone as getCardsInZoneByType,
  getCardsOwnedByPlayer,
  getOpponentId,
  hasTrait,
  isCardDamaged,
  isCardInZone as isCardInZoneCheck,
  // State helpers
  isCardRested,
  matchesCardFilter,
  // Property helpers (for testing)
  matchesCardType,
  matchesColor,
  matchesCostFilter,
  matchesFilter,
  matchesLevelFilter,
  matchesPropertyFilter,
  matchesStateFilter,
  type TargetingContext,
  validateTargets,
} from "./targeting-system";

// Trigger detection system
export {
  type ActivePlayerOrderResult,
  type AttackTriggerEvent,
  type DeployTriggerEvent,
  type DestroyedTriggerEvent,
  detectAttackTriggers,
  detectDeployTriggers,
  detectDestroyedTriggers,
  detectEndOfTurnTriggers,
  detectStartOfTurnTriggers,
  detectTriggeredEffects,
  type EndOfTurnTriggerEvent,
  orderTriggeredEffects,
  type StartOfTurnTriggerEvent,
  type TriggerDetectionResult,
  type TriggerEvent,
  type TriggeredEffectRef,
} from "./trigger-detection";

// Trigger integration helpers
export {
  detectAndEnqueueAttackTriggers,
  detectAndEnqueueDeployTriggers,
  detectAndEnqueueDestroyedTriggers,
  detectAndEnqueueEndOfTurnTriggers,
  detectAndEnqueueStartOfTurnTriggers,
} from "./trigger-integration";
