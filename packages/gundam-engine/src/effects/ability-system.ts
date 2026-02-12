/**
 * Gundam Ability System
 *
 * Connects effects to cards and manages ability triggering and execution.
 * Integrates with the Gundam game engine for seamless ability handling.
 *
 * Ability Types:
 * - Triggered: Activate when a condition occurs (deploy, attack, etc.)
 * - Activated: Player chooses to activate (usually with a cost)
 * - Static: Always in effect while card is in play
 */

import type { CardId, PlayerId } from "@tcg/core";
import type { GundamGameState } from "../types";
import {
  createEffectContext,
  type EffectContext,
  type EffectResult,
  executeEffect,
} from "./effect-executor";
import type { AbilityDefinition, Effect } from "./effect-types";

// ============================================================================
// Ability Types
// ============================================================================

/**
 * Trigger types for triggered abilities
 */
export type TriggerType =
  | "ON_DEPLOY" // When unit is deployed
  | "ON_ATTACK" // When unit attacks
  | "ON_DEFENSE" // When unit blocks
  | "ON_DESTROY" // When unit is destroyed
  | "ON_DAMAGE" // When unit deals damage
  | "ON_DAMAGED" // When unit takes damage
  | "ON_REST" // When unit rests
  | "ON_STAND" // When unit stands
  | "TURN_START" // At start of turn
  | "TURN_END" // At end of turn
  | "PHASE_START" // At start of phase
  | "PHASE_END" // At end of phase
  | "WHEN_ATTACK_DECLARED" // When attack is declared
  | "WHEN_BLOCK_DECLARED" // When block is declared
  | "ON_PAIR" // When pilot is paired
  | "ON_UNPAIR" // When pilot is unpaired
  | "CUSTOM"; // Custom trigger condition

/**
 * Ability with trigger information
 */
export interface TriggeredAbility extends AbilityDefinition {
  readonly type: "triggered";
  readonly trigger: TriggerType;
  readonly triggerCondition?: (
    state: GundamGameState,
    cardId: CardId,
  ) => boolean;
  readonly oncePerTurn?: boolean;
}

/**
 * Ability with activation cost
 */
export interface ActivatedAbility extends AbilityDefinition {
  readonly type: "activated";
  readonly cost: {
    readonly rest?: boolean;
    readonly restTargets?: number;
    readonly payResources?: number;
    readonly discard?: number;
    readonly sendToTrash?: CardId;
    readonly reveal?: CardId;
  };
  readonly activationCondition?: (
    state: GundamGameState,
    cardId: CardId,
  ) => boolean;
  readonly oncePerTurn?: boolean;
}

/**
 * Static ability (always active)
 */
export interface StaticAbility extends AbilityDefinition {
  readonly type: "static";
  readonly appliesTo?:
    | "this"
    | "each-friendly-unit"
    | "each-opponent-unit"
    | "all";
  readonly condition?: (state: GundamGameState, cardId: CardId) => boolean;
}

/**
 * Card ability definition
 */
export type CardAbility = TriggeredAbility | ActivatedAbility | StaticAbility;

// ============================================================================
// Card Ability Registry
// ============================================================================

/**
 * Registry of abilities by card ID
 */
interface AbilityRegistry {
  readonly [cardId: string]: readonly CardAbility[];
}

/**
 * In-memory ability registry
 */
let abilityRegistry: AbilityRegistry = {};

/**
 * Register abilities for a card
 */
export function registerAbilities(
  cardId: string,
  abilities: readonly CardAbility[],
): void {
  abilityRegistry = {
    ...abilityRegistry,
    [cardId]: abilities,
  };
}

/**
 * Get abilities for a card
 */
export function getAbilities(cardId: string): readonly CardAbility[] {
  return abilityRegistry[cardId] ?? [];
}

/**
 * Clear all registered abilities (useful for testing)
 */
export function clearAbilities(): void {
  abilityRegistry = {};
}

// ============================================================================
// Ability Triggering
// ============================================================================

/**
 * Event that can trigger abilities
 */
export interface TriggerEvent {
  readonly type: TriggerType;
  readonly cardId: CardId;
  readonly player: PlayerId;
  readonly data?: unknown;
}

/**
 * Find all abilities that match a trigger event
 */
export function findMatchingAbilities(
  event: TriggerEvent,
  state: GundamGameState,
): Array<{ cardId: CardId; ability: CardAbility }> {
  const matches: Array<{ cardId: CardId; ability: CardAbility }> = [];

  // Check all cards in play
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];
    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const abilities = getAbilities(cardId);

      for (const ability of abilities) {
        if (ability.type === "triggered" && ability.trigger === event.type) {
          // Check trigger condition if present
          if (
            !ability.triggerCondition ||
            ability.triggerCondition(state, cardId)
          ) {
            matches.push({ cardId, ability });
          }
        }
      }
    }
  }

  return matches;
}

/**
 * Execute a triggered ability
 */
export function executeTriggeredAbility(
  cardId: CardId,
  ability: TriggeredAbility,
  state: GundamGameState,
  player: PlayerId,
): EffectResult {
  const context = createEffectContext(state, player, cardId);
  return executeEffect(ability.effect, context);
}

// ============================================================================
// Ability Activation
// ============================================================================

/**
 * Check if an activated ability can be activated
 */
export function canActivateAbility(
  cardId: CardId,
  ability: ActivatedAbility,
  state: GundamGameState,
  player: PlayerId,
): boolean {
  // Check if player controls the card
  const cardInPlay = isCardInPlay(state, cardId, player);
  if (!cardInPlay) return false;

  // Check activation condition
  if (
    ability.activationCondition &&
    !ability.activationCondition(state, cardId)
  ) {
    return false;
  }

  // Check if card is rested (can't activate abilities of rested cards)
  const position = state.gundam.cardPositions[cardId];
  if (position === "rested") {
    return false;
  }

  // Check if already used this turn
  if (ability.oncePerTurn) {
    // Would need to track activations per turn
  }

  // Check if cost can be paid
  return canPayCost(ability.cost, state, player);
}

/**
 * Pay the cost of an ability
 */
export function payCost(
  cost: ActivatedAbility["cost"],
  state: GundamGameState,
  player: PlayerId,
): GundamGameState {
  // Implementation would modify state to pay costs
  return state;
}

/**
 * Check if a cost can be paid
 */
function canPayCost(
  cost: ActivatedAbility["cost"],
  state: GundamGameState,
  player: PlayerId,
): boolean {
  if (cost.payResources !== undefined) {
    const activeResources = state.gundam.activeResources[player] ?? 0;
    if (activeResources < cost.payResources) return false;
  }

  if (cost.discard !== undefined) {
    const handSize = state.zones.hand[player]?.cards.length ?? 0;
    if (handSize < cost.discard) return false;
  }

  return true;
}

/**
 * Execute an activated ability
 */
export function executeActivatedAbility(
  cardId: CardId,
  ability: ActivatedAbility,
  state: GundamGameState,
  player: PlayerId,
): EffectResult {
  // Pay cost first
  const stateAfterCost = payCost(ability.cost, state, player);

  // Execute effect
  const context = createEffectContext(stateAfterCost, player, cardId);
  const result = executeEffect(ability.effect, context);

  return result;
}

// ============================================================================
// Static Abilities
// ============================================================================

/**
 * Get all static abilities affecting the game
 */
export function getStaticAbilities(
  state: GundamGameState,
): Array<{ cardId: CardId; ability: StaticAbility }> {
  const staticAbilities: Array<{ cardId: CardId; ability: StaticAbility }> = [];

  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];
    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const abilities = getAbilities(cardId);

      for (const ability of abilities) {
        if (ability.type === "static") {
          // Check condition if present
          if (!ability.condition || ability.condition(state, cardId)) {
            staticAbilities.push({ cardId, ability });
          }
        }
      }
    }
  }

  return staticAbilities;
}

/**
 * Apply static abilities to modify a value
 */
export function applyStaticModifiers<T>(
  state: GundamGameState,
  cardId: CardId,
  property: "ap" | "hp",
  baseValue: T,
): T {
  const staticAbilities = getStaticAbilities(state);
  const modifiedValue = baseValue;

  for (const { ability } of staticAbilities) {
    const effect = ability.effect;

    // Check if this is a stat modification effect
    if (effect.type === `modify-${property}`) {
      // Would apply the modifier
    }
  }

  return modifiedValue;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a card is in play (in battle area or base section)
 */
function isCardInPlay(
  state: GundamGameState,
  cardId: CardId,
  player: PlayerId,
): boolean {
  const battleArea = state.zones.battleArea[player];
  const baseSection = state.zones.baseSection[player];

  return (
    (battleArea?.cards?.includes(cardId) ?? false) ||
    (baseSection?.cards?.includes(cardId) ?? false)
  );
}

/**
 * Create a triggered ability
 */
export function createTriggeredAbility(
  trigger: TriggerType,
  effect: Effect,
  options?: {
    name?: string;
    description?: string;
    oncePerTurn?: boolean;
    triggerCondition?: (state: GundamGameState, cardId: CardId) => boolean;
  },
): TriggeredAbility {
  return {
    type: "triggered",
    trigger,
    effect,
    ...options,
  };
}

/**
 * Create an activated ability
 */
export function createActivatedAbility(
  cost: ActivatedAbility["cost"],
  effect: Effect,
  options?: {
    name?: string;
    description?: string;
    oncePerTurn?: boolean;
    activationCondition?: (state: GundamGameState, cardId: CardId) => boolean;
  },
): ActivatedAbility {
  return {
    type: "activated",
    cost,
    effect,
    ...options,
  };
}

/**
 * Create a static ability
 */
export function createStaticAbility(
  effect: Effect,
  options?: {
    name?: string;
    description?: string;
    appliesTo?: "this" | "each-friendly-unit" | "each-opponent-unit" | "all";
    condition?: (state: GundamGameState, cardId: CardId) => boolean;
  },
): StaticAbility {
  return {
    type: "static",
    effect,
    ...options,
  };
}

// ============================================================================
// Integration with Game Engine
// ============================================================================

/**
 * Process trigger events and return modified state
 */
export function processTriggerEvents(
  state: GundamGameState,
  events: TriggerEvent[],
): GundamGameState {
  let currentState = state;

  for (const event of events) {
    const matchingAbilities = findMatchingAbilities(event, currentState);

    for (const { cardId, ability } of matchingAbilities) {
      if (ability.type === "triggered") {
        const result = executeTriggeredAbility(
          cardId,
          ability,
          currentState,
          event.player,
        );
        if (result.success) {
          currentState = result.state;
        }
      }
    }
  }

  return currentState;
}

/**
 * Get all activatable abilities for a player
 */
export function getActivatableAbilities(
  state: GundamGameState,
  player: PlayerId,
): Array<{
  cardId: CardId;
  ability: ActivatedAbility;
}> {
  const activatable: Array<{ cardId: CardId; ability: ActivatedAbility }> = [];

  const battleArea = state.zones.battleArea[player];
  if (!battleArea?.cards) return activatable;

  for (const cardId of battleArea.cards) {
    const abilities = getAbilities(cardId);

    for (const ability of abilities) {
      if (
        ability.type === "activated" &&
        canActivateAbility(cardId, ability, state, player)
      ) {
        activatable.push({ cardId, ability });
      }
    }
  }

  return activatable;
}
