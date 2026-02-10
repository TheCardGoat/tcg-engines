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

export type { EffectInstance, EffectStackState } from "../types/effects";
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
  type TriggerEvent,
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
  type EffectContext,
  type EffectEvent,
  type EffectResult,
  type EventType,
  executeEffect,
  type PendingChoice,
  type ResolvedTarget,
} from "./effect-executor";
// Effect stack management
export {
  clearEffectDefinitions,
  createEffectStack,
  dequeueEffect,
  enqueueBatchEffects,
  enqueueEffect,
  findEffectInstance,
  getEffectDefinition,
  getEffectStackCount,
  isEffectStackEmpty,
  markEffectFizzled,
  markEffectResolved,
  markEffectResolving,
  peekNextEffect,
  registerEffectDefinition,
  updateEffectInstance,
} from "./effect-stack";
// Type definitions
export type * from "./effect-types";
// All builder functions are re-exported from effect-types
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
// Targeting system (legacy - for backward compatibility)
export {
  chosenCardTarget,
  chosenUnitTarget,
  eachFriendlyUnitTarget,
  eachOpponentUnitTarget,
  eachUnitTarget,
  filterTargets,
  filterTargetsByController,
  filterTargetsByPosition,
  getAllUnits,
  getBase,
  getCardsInDeck,
  getCardsInHand,
  getCardsInTrash,
  getCardsInZone,
  getRandomTargets,
  getResources,
  getShields,
  getUnitsInBattleArea,
  isValidTarget,
  isValidTargetId,
  limitTargets,
  opponentTarget,
  resolveTarget,
  selfTarget,
  target,
  thisTarget,
} from "./targeting";
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
  orderTriggeredEffectsCustom,
  type StartOfTurnTriggerEvent,
  type TriggerDetectionContext,
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
