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
import type { GundamGameState } from "../types";
import type { EffectDefinition, EffectTiming } from "../types/effects";
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
 * Fired when a unit is deployed to the battle area.
 */
export interface DeployTriggerEvent extends BaseTriggerEvent {
  readonly type: "DEPLOY";
  /** ID of the deployed unit */
  readonly cardId: CardId;
}

/**
 * Attack Trigger Event
 *
 * Fired when a unit declares an attack.
 */
export interface AttackTriggerEvent extends BaseTriggerEvent {
  readonly type: "ATTACK";
  /** ID of the attacking unit */
  readonly attackerId: CardId;
  /** ID of the target (if any) */
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
  /** ID of the destroyed card */
  readonly cardId: CardId;
}

/**
 * Start of Turn Trigger Event
 *
 * Fired at the beginning of a player's turn.
 */
export interface StartOfTurnTriggerEvent extends BaseTriggerEvent {
  readonly type: "START_OF_TURN";
}

/**
 * End of Turn Trigger Event
 *
 * Fired at the end of a player's turn.
 */
export interface EndOfTurnTriggerEvent extends BaseTriggerEvent {
  readonly type: "END_OF_TURN";
}

// ============================================================================
// TRIGGER DETECTION RESULTS
// ============================================================================

/**
 * Triggered Effect Reference
 *
 * Represents a triggered effect ready to be enqueued.
 * Contains the minimal information needed to create an effect instance.
 */
export interface TriggeredEffectRef {
  /** Card that generated this effect */
  readonly sourceCardId: CardId;
  /** Reference to the effect definition */
  readonly effectRef: { effectId: string };
  /** Player controlling this effect (owner of the source card) */
  readonly controllerId: PlayerId;
}

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
// TRIGGER DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects all triggered effects for a given trigger event
 *
 * This is the main entry point for trigger detection. It dispatches
 * to specialized detection functions based on the event type.
 *
 * @param state - Current game state
 * @param event - Trigger event to detect effects for
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * const event: DeployTriggerEvent = {
 *   type: "DEPLOY",
 *   playerId: "p1",
 *   cardId: "unit-123",
 * };
 * const result = detectTriggeredEffects(state, event);
 * if (result.hasTriggers) {
 *   // Enqueue effects in order chosen by active player
 * }
 * ```
 */
export function detectTriggeredEffects(
  state: GundamGameState,
  event: TriggerEvent,
): TriggerDetectionResult {
  switch (event.type) {
    case "DEPLOY": {
      return detectDeployTriggers(state, event.cardId, event.playerId);
    }
    case "ATTACK": {
      return detectAttackTriggers(state, event.attackerId, event.targetId, event.playerId);
    }
    case "DESTROYED": {
      return detectDestroyedTriggers(state, event.cardId, event.playerId);
    }
    case "START_OF_TURN": {
      return detectStartOfTurnTriggers(state, event.playerId);
    }
    case "END_OF_TURN": {
      return detectEndOfTurnTriggers(state, event.playerId);
    }
    default: {
      return { effects: [], hasTriggers: false };
    }
  }
}

/**
 * Detects 【Deploy】 triggered effects
 *
 * Scans all cards in play for effects with DEPLOY timing.
 * These effects trigger when a unit enters the battle area.
 *
 * @param state - Current game state
 * @param deployedCardId - ID of the deployed unit
 * @param playerId - Player who deployed the unit
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * // Unit with "When you deploy a unit, draw a card" triggers
 * // Unit with "When this unit deploys, deal 1 damage" triggers
 * ```
 */
export function detectDeployTriggers(
  state: GundamGameState,
  deployedCardId: CardId,
  playerId: PlayerId,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with deploy triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];
    if (!battleArea?.cards) {
      continue;
    }

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) {
        continue;
      }

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesDeployTiming(effect.timing)) {
          effects.push({
            controllerId: player,
            effectRef: { effectId: effect.id },
            sourceCardId: cardId,
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
 * Detects 【Attack】 triggered effects
 *
 * Scans all cards in play for effects with ATTACK timing.
 * These effects trigger when a unit declares an attack.
 *
 * @param state - Current game state
 * @param attackerId - ID of the attacking unit
 * @param targetId - ID of the target (if any)
 * @param playerId - Player controlling the attacker
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * // Unit with "When this unit attacks, draw a card" triggers
 * // Unit with "When a unit you control attacks, gain 1 life" triggers
 * ```
 */
export function detectAttackTriggers(
  state: GundamGameState,
  attackerId: CardId,
  targetId: CardId | undefined,
  playerId: PlayerId,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with attack triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];
    if (!battleArea?.cards) {
      continue;
    }

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) {
        continue;
      }

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesAttackTiming(effect.timing)) {
          effects.push({
            controllerId: player,
            effectRef: { effectId: effect.id },
            sourceCardId: cardId,
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
 * Detects 【Destroyed】 triggered effects
 *
 * Scans all cards in play for effects with DESTROYED timing.
 * These effects trigger when a unit/base is destroyed.
 *
 * @param state - Current game state
 * @param destroyedCardId - ID of the destroyed card
 * @param playerId - Player who owned the destroyed card
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * // Unit with "When this unit is destroyed, draw a card" triggers
 * // Unit with "When a unit is destroyed, deal 1 damage" triggers
 * ```
 */
export function detectDestroyedTriggers(
  state: GundamGameState,
  destroyedCardId: CardId,
  playerId: PlayerId,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for cards with destroyed triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];
    if (!battleArea?.cards) {
      continue;
    }

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) {
        continue;
      }

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesDestroyedTiming(effect.timing)) {
          effects.push({
            controllerId: player,
            effectRef: { effectId: effect.id },
            sourceCardId: cardId,
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
 * Detects Start of Turn triggered effects
 *
 * Scans all cards in play for effects with START_OF_TURN timing.
 * These effects trigger at the beginning of a player's turn.
 *
 * @param state - Current game state
 * @param playerId - Player whose turn is starting
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * // Unit with "At start of your turn, draw a card" triggers
 * ```
 */
export function detectStartOfTurnTriggers(
  state: GundamGameState,
  playerId: PlayerId,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan current player's cards for start of turn triggers
  const battleArea = state.zones.battleArea[playerId];
  if (battleArea?.cards) {
    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) {
        continue;
      }

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesStartOfTurnTiming(effect.timing)) {
          effects.push({
            controllerId: playerId,
            effectRef: { effectId: effect.id },
            sourceCardId: cardId,
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
 * Detects End of Turn triggered effects
 *
 * Scans all cards in play for effects with END_OF_TURN timing.
 * These effects trigger at the end of a player's turn.
 *
 * @param state - Current game state
 * @param playerId - Player whose turn is ending
 * @returns Detection result with all matching effects
 *
 * @example
 * ```typescript
 * // Unit with "At end of turn, heal 1 damage" triggers
 * ```
 */
export function detectEndOfTurnTriggers(
  state: GundamGameState,
  playerId: PlayerId,
): TriggerDetectionResult {
  const effects: TriggeredEffectRef[] = [];

  // Scan all players' battle areas for end of turn triggers
  for (const player of state.players) {
    const battleArea = state.zones.battleArea[player];
    if (!battleArea?.cards) {
      continue;
    }

    for (const cardId of battleArea.cards) {
      const cardDef = getCardDefinition(cardId);
      if (!cardDef) {
        continue;
      }

      // Check each effect on the card
      for (const effect of cardDef.effects ?? []) {
        if (matchesEndOfTurnTiming(effect.timing)) {
          effects.push({
            controllerId: player,
            effectRef: { effectId: effect.id },
            sourceCardId: cardId,
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
 */
function matchesDeployTiming(timing: EffectTiming): boolean {
  return timing.type === "DEPLOY";
}

/**
 * Checks if an effect timing matches ATTACK trigger
 */
function matchesAttackTiming(timing: EffectTiming): boolean {
  return timing.type === "ATTACK";
}

/**
 * Checks if an effect timing matches DESTROYED trigger
 */
function matchesDestroyedTiming(timing: EffectTiming): boolean {
  return timing.type === "DESTROYED";
}

/**
 * Checks if an effect timing matches START_OF_TURN trigger
 */
function matchesStartOfTurnTiming(timing: EffectTiming): boolean {
  return timing.type === "START_OF_TURN";
}

/**
 * Checks if an effect timing matches END_OF_TURN trigger
 */
function matchesEndOfTurnTiming(timing: EffectTiming): boolean {
  return timing.type === "END_OF_TURN";
}

// ============================================================================
// ACTIVE PLAYER ORDERING
// ============================================================================

/**
 * Active Player Ordering Result
 *
 * Contains the ordering array for batch enqueueing.
 * The order array contains indices into the effects array.
 */
export interface ActivePlayerOrderResult {
  /** Order array for enqueueBatchEffects */
  readonly order: readonly number[];
  /** Active player's effects (indices) */
  readonly activePlayerEffects: readonly number[];
  /** Opponent's effects (indices) */
  readonly opponentEffects: readonly number[];
}

/**
 * Creates an ordering for simultaneous triggered effects
 *
 * When multiple effects trigger simultaneously, the active player
 * chooses the resolution order. Active player's effects are ordered
 * first, then opponent's effects.
 *
 * Per Rule 11-3: When multiple effects trigger simultaneously,
 * the active player chooses the resolution order.
 *
 * @param effects - Detected triggered effects
 * @param activePlayerId - Player who is currently active
 * @returns Ordering result with order array
 *
 * @example
 * ```typescript
 * const effects = [
 *   { sourceCardId: "card-1", controllerId: "p1", ... },
 *   { sourceCardId: "card-2", controllerId: "p2", ... },
 *   { sourceCardId: "card-3", controllerId: "p1", ... },
 * ];
 * // If p1 is active player:
 * // Active player effects: [0, 2] (card-1, card-3)
 * // Opponent effects: [1] (card-2)
 * // Default order: [0, 2, 1] - active player's effects first
 * ```
 */
export function orderTriggeredEffects(
  effects: readonly TriggeredEffectRef[],
  activePlayerId: PlayerId,
): ActivePlayerOrderResult {
  // Group effects by controller
  const activePlayerEffects: number[] = [];
  const opponentEffects: number[] = [];

  for (let i = 0; i < effects.length; i++) {
    const effect = effects[i]!;
    if (effect.controllerId === activePlayerId) {
      activePlayerEffects.push(i);
    } else {
      opponentEffects.push(i);
    }
  }

  // Default order: active player's effects first, then opponent's
  // The player would typically customize this order via UI
  const order = [...activePlayerEffects, ...opponentEffects];

  return {
    activePlayerEffects,
    opponentEffects,
    order,
  };
}

/**
 * Creates a custom ordering for triggered effects
 *
 * Allows specifying a custom order when the default (active player first)
 * is not desired. Used when players make choices via UI.
 *
 * @param effects - Detected triggered effects
 * @param customOrder - Custom order array
 * @returns Ordering result
 *
 * @example
 * ```typescript
 * // Player chooses to resolve effect 2, then 0, then 1
 * const result = orderTriggeredEffectsCustom(effects, [2, 0, 1]);
 * ```
 */
export function orderTriggeredEffectsCustom(
  effects: readonly TriggeredEffectRef[],
  customOrder: number[],
): ActivePlayerOrderResult {
  // Validate order indices
  for (const index of customOrder) {
    if (index < 0 || index >= effects.length) {
      throw new Error(`Invalid order index ${index}: must be between 0 and ${effects.length - 1}`);
    }
  }

  // Determine which effects belong to active player
  // (This would need activePlayerId parameter, omitting for simplicity)
  const activePlayerEffects: number[] = [];
  const opponentEffects: number[] = [];

  return {
    activePlayerEffects,
    opponentEffects,
    order: customOrder,
  };
}

// ============================================================================
// TRIGGER DETECTION CONTEXT
// ============================================================================

/**
 * Trigger Detection Context
 *
 * Context passed to trigger detection functions for additional
 * filtering or validation of triggered effects.
 */
export interface TriggerDetectionContext {
  /** Player who is currently active */
  readonly activePlayerId: PlayerId;
  /** Current phase */
  readonly phase: string;
  /** Current turn number */
  readonly turn: number;
  /** Optional card definitions for effect lookup */
  readonly cardDefinitions?: Record<CardId, EffectDefinition[]>;
}

/**
 * Enhanced trigger detection with context
 *
 * Future enhancement for more sophisticated trigger detection
 * that considers game state context beyond just the event.
 *
 * @param state - Current game state
 * @param event - Trigger event
 * @param context - Detection context
 * @returns Detection result
 */
export function detectTriggeredEffectsWithContext(
  state: GundamGameState,
  event: TriggerEvent,
  context: TriggerDetectionContext,
): TriggerDetectionResult {
  // For now, delegate to basic detection
  // Future: Use context for additional filtering
  return detectTriggeredEffects(state, event);
}
