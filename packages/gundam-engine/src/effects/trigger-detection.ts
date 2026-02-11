/**
 * Gundam Card Game - Trigger Detection System
 *
 * Detects triggered effects from game events and integrates them with
 * the effect stack. This module enables automatic effect triggering from
 * game events (Deploy, Attack, Destroyed, Start/End of Turn, etc.).
 *
 * Rule References:
 * - Rule 11-2: Triggered effects activate when specific conditions occur
 * - Rule 11-3: Multiple simultaneous triggers are ordered by active player
 * - Rule 6-1-3: Phases do not advance until all triggered effects resolve
 *
 * @module effects/trigger-detection
 */

import type { CardId, PlayerId } from "@tcg/core";
import type { EffectTiming } from "@tcg/gundam-types/effects";
import type { GundamGameState } from "../types";
import { getCardDefinition } from "./action-handlers";

// ============================================================================
// TRIGGER EVENT TYPES
// ============================================================================

/**
 * Trigger Event
 *
 * Represents a game event that can trigger effects.
 * The `type` field enables discriminated union type narrowing.
 */
export type TriggerEvent =
  | DeployTriggerEvent
  | AttackTriggerEvent
  | DestroyedTriggerEvent
  | StartOfTurnTriggerEvent
  | EndOfTurnTriggerEvent;

/**
 * Base properties for all trigger events
 */
interface BaseTriggerEvent {
  /** Type of trigger event */
  readonly type: string;

  /** Player associated with the event */
  readonly playerId: PlayerId;
}

/**
 * Deploy Trigger Event
 *
 * Fired when a unit is deployed to battle area.
 */
export interface DeployTriggerEvent extends BaseTriggerEvent {
  readonly type: "DEPLOY";

  /** ID of deployed unit */
  readonly cardId: CardId;
}

/**
 * Attack Trigger Event
 *
 * Fired when a unit declares an attack.
 */
export interface AttackTriggerEvent extends BaseTriggerEvent {
  readonly type: "ATTACK";

  /** ID of attacking unit */
  readonly attackerId: CardId;

  /** ID of target (if any) */
  readonly targetId?: CardId;

  /** Attack step for more precise timing */
  readonly step?: "declaration" | "damage" | "end";
}

/**
 * Destroyed Trigger Event
 *
 * Fired when a unit/base is destroyed.
 */
export interface DestroyedTriggerEvent extends BaseTriggerEvent {
  readonly type: "DESTROYED";

  /** ID of destroyed card */
  readonly cardId: CardId;
}

/**
 * Start of Turn Trigger Event
 *
 * Fired at the beginning of a player's turn.
 */
export interface StartOfTurnTriggerEvent extends BaseTriggerEvent {
  readonly type: "START_OF_TURN";

  /** Player whose turn is starting */
  readonly playerId: PlayerId;
}

/**
 * End of Turn Trigger Event
 *
 * Fired at the end of a player's turn.
 */
export interface EndOfTurnTriggerEvent extends BaseTriggerEvent {
  readonly type: "END_OF_TURN";

  /** Player whose turn is ending */
  readonly playerId: PlayerId;
}

// ============================================================================
// TRIGGERED EFFECT REFERENCE
// ============================================================================

/**
 * Triggered Effect Reference
 *
 * Represents a triggered effect ready to be enqueued.
 * Contains minimal information needed to create an effect instance.
 */
export interface TriggeredEffectRef {
  /** Card that generated this effect */
  readonly sourceCardId: CardId;

  /** Reference to the effect definition */
  readonly effectRef: {
    readonly effectId: string;
  };

  /** Player controlling this effect (owner of source card) */
  readonly controllerId: PlayerId;
}

// ============================================================================
// TRIGGER DETECTION RESULT
// ============================================================================

/**
 * Trigger Detection Result
 *
 * Result of detecting triggered effects for an event.
 * Contains all effects that should trigger, grouped for ordering.
 */
export interface TriggerDetectionResult {
  /** All detected triggered effects */
  readonly effects: readonly TriggeredEffectRef[];

  /** Whether any effects were detected */
  readonly hasTriggers: boolean;
}

// ============================================================================
// ACTIVE PLAYER ORDER RESULT
// ============================================================================

/**
 * Active Player Order Result
 *
 * Result of ordering triggered effects by active player choice.
 * Contains the ordered indices and which effects belong to each player.
 */
export interface ActivePlayerOrderResult {
  /** The order in which effects should resolve (indices into effects array) */
  readonly order: readonly number[];

  /** Indices of effects controlled by the active player */
  readonly activePlayerEffects: readonly number[];

  /** Indices of effects controlled by the opponent */
  readonly opponentEffects: readonly number[];
}

// ============================================================================
// TRIGGER DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects all triggered effects for a given trigger event
 *
 * This is the main entry point for trigger detection. It dispatches
 * to specialized detection functions based on event type.
 *
 * @param state - Current game state
 * @param event - Trigger event to detect effects for
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * const event: DeployTriggerEvent = {
 *   type: "DEPLOY",
 *   cardId: "unit-123" as CardId,
 *   playerId: "player-1" as PlayerId,
 * };
 *
 * const result = detectTriggeredEffects(state, event);
 * if (result.hasTriggers) {
 *   // Enqueue detected effects in order chosen by active player
 * }
 * ```
 */
export function detectTriggeredEffects(
  state: GundamGameState,
  event: TriggerEvent,
): TriggerDetectionResult {
  switch (event.type) {
    case "DEPLOY":
      return detectDeployTriggers(state, event);
    case "ATTACK":
      return detectAttackTriggers(state, event);
    case "DESTROYED":
      return detectDestroyedTriggers(state, event);
    case "START_OF_TURN":
      return detectStartOfTurnTriggers(state, event);
    case "END_OF_TURN":
      return detectEndOfTurnTriggers(state, event);
  }
}

/**
 * Detects deploy-triggered effects
 *
 * Scans all players' battle areas for cards with deploy timing effects.
 *
 * @param state - Current game state
 * @param event - Deploy trigger event
 * @returns Detection result with matching effects
 */
export function detectDeployTriggers(
  state: GundamGameState,
  event: DeployTriggerEvent,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with deploy triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];

    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);

      if (!cardDef) continue;

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesDeployTiming(effect.timing)) {
          effects.push({
            sourceCardId: cardId,
            effectRef: { effectId: effect.id },
            controllerId: player,
          });
        }
      }
    }
  }

  return {
    effects,
    hasTriggers: effects.length > 0,
  };
}

/**
 * Detects attack-triggered effects
 *
 * Scans all players' battle areas for cards with attack timing effects.
 *
 * @param state - Current game state
 * @param event - Attack trigger event
 * @returns Detection result with matching effects
 */
export function detectAttackTriggers(
  state: GundamGameState,
  event: AttackTriggerEvent,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with attack triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];

    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);

      if (!cardDef) continue;

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesAttackTiming(effect.timing)) {
          effects.push({
            sourceCardId: cardId,
            effectRef: { effectId: effect.id },
            controllerId: player,
          });
        }
      }
    }
  }

  return {
    effects,
    hasTriggers: effects.length > 0,
  };
}

/**
 * Detects destroyed-triggered effects
 *
 * Scans all players' battle areas for cards with destroyed timing effects.
 *
 * @param state - Current game state
 * @param event - Destroyed trigger event
 * @returns Detection result with matching effects
 */
export function detectDestroyedTriggers(
  state: GundamGameState,
  event: DestroyedTriggerEvent,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with destroyed triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];

    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);

      if (!cardDef) continue;

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesDestroyedTiming(effect.timing)) {
          effects.push({
            sourceCardId: cardId,
            effectRef: { effectId: effect.id },
            controllerId: player,
          });
        }
      }
    }
  }

  return {
    effects,
    hasTriggers: effects.length > 0,
  };
}

/**
 * Detects start-of-turn-triggered effects
 *
 * Scans all players' battle areas for start-of-turn timing effects.
 * Only cards in play (on the battlefield) are checked for triggers.
 *
 * @param state - Current game state
 * @param event - Start of turn trigger event
 * @returns Detection result with matching effects
 */
export function detectStartOfTurnTriggers(
  state: GundamGameState,
  event: StartOfTurnTriggerEvent,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with start of turn triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];

    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) continue;

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesStartOfTurnTiming(effect.timing)) {
          effects.push({
            sourceCardId: cardId,
            effectRef: { effectId: effect.id },
            controllerId: player,
          });
        }
      }
    }
  }

  return {
    effects,
    hasTriggers: effects.length > 0,
  };
}

/**
 * Detects end-of-turn-triggered effects
 *
 * Scans all players' battle areas for end-of-turn timing effects.
 * Only cards in play (on the battlefield) are checked for triggers.
 *
 * @param state - Current game state
 * @param event - End of turn trigger event
 * @returns Detection result with matching effects
 */
export function detectEndOfTurnTriggers(
  state: GundamGameState,
  event: EndOfTurnTriggerEvent,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with end of turn triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];

    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) continue;

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesEndOfTurnTiming(effect.timing)) {
          effects.push({
            sourceCardId: cardId,
            effectRef: { effectId: effect.id },
            controllerId: player,
          });
        }
      }
    }
  }

  return {
    effects,
    hasTriggers: effects.length > 0,
  };
}

// ============================================================================
// TIMING MATCHING HELPERS
// ============================================================================

/**
 * Checks if an effect timing matches DEPLOY trigger
 *
 * @param timing - Effect timing to check
 * @returns Whether timing matches deploy trigger
 */
function matchesDeployTiming(timing: EffectTiming): boolean {
  return timing.type === "DEPLOY";
}

/**
 * Checks if an effect timing matches ATTACK trigger
 *
 * @param timing - Effect timing to check
 * @returns Whether timing matches attack trigger
 */
function matchesAttackTiming(timing: EffectTiming): boolean {
  return timing.type === "ATTACK";
}

/**
 * Checks if an effect timing matches DESTROYED trigger
 *
 * @param timing - Effect timing to check
 * @returns Whether timing matches destroyed trigger
 */
function matchesDestroyedTiming(timing: EffectTiming): boolean {
  return timing.type === "DESTROYED";
}

/**
 * Checks if an effect timing matches START_OF_TURN trigger
 *
 * @param timing - Effect timing to check
 * @returns Whether timing matches start of turn trigger
 */
function matchesStartOfTurnTiming(timing: EffectTiming): boolean {
  return timing.type === "START_OF_TURN";
}

/**
 * Checks if an effect timing matches END_OF_TURN trigger
 *
 * @param timing - Effect timing to check
 * @returns Whether timing matches end of turn trigger
 */
function matchesEndOfTurnTiming(timing: EffectTiming): boolean {
  return timing.type === "END_OF_TURN";
}

// ============================================================================
// ACTIVE PLAYER ORDERING
// ============================================================================

/**
 * Orders triggered effects by active player choice
 *
 * When multiple effects trigger simultaneously, the active player chooses
 * the resolution order. This function builds the order structure that
 * separates active player's effects from opponent's effects.
 *
 * @param effects - Array of triggered effects to order
 * @param activePlayerId - Player ID of the active player
 * @returns Order result with effect indices
 *
 * @example
 * ```typescript
 * const result = orderTriggeredEffects(effects, "player-1");
 * // result.order contains indices in resolution order
 * // result.activePlayerEffects are indices of player-1's effects
 * // result.opponentEffects are indices of other players' effects
 * ```
 */
export function orderTriggeredEffects(
  effects: readonly TriggeredEffectRef[],
  activePlayerId: PlayerId,
): ActivePlayerOrderResult {
  // Separate effects by controller
  const activePlayerEffects: number[] = [];
  const opponentEffects: number[] = [];

  for (let i = 0; i < effects.length; i++) {
    if (effects[i]!.controllerId === activePlayerId) {
      activePlayerEffects.push(i);
    } else {
      opponentEffects.push(i);
    }
  }

  // Build order array (defaults to natural order)
  const order: number[] = [];
  for (let i = 0; i < effects.length; i++) {
    order.push(i);
  }

  return {
    order,
    activePlayerEffects,
    opponentEffects,
  };
}
