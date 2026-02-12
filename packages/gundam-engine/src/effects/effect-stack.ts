/**
 * Gundam Card Game - Effect Stack Management
 *
 * This module provides helper functions for managing the effect stack,
 * which tracks pending effects waiting to resolve. Effects are processed
 * in FIFO (First-In, First-Out) order.
 *
 * Stack Operations:
 * - Enqueue: Add effects to the end of the stack
 * - Dequeue: Remove effects from the front of the stack
 * - Query: Inspect stack state without mutation
 * - Lifecycle: Track effect resolution state (pending/resolving/resolved/fizzled)
 *
 * @module effects/effect-stack
 */

import type { CardId, PlayerId } from "@tcg/core";
import type { GundamGameState } from "../types";
import type { EffectDefinition, EffectInstance, EffectStackState } from "../types/effects";

// ============================================================================
// STACK INITIALIZATION
// ============================================================================

/**
 * Creates a new empty effect stack
 *
 * Used during game state initialization to set up the effect stack.
 * Returns a stack with no effects and a counter starting at 0.
 *
 * @returns New empty effect stack state
 *
 * @example
 * ```typescript
 * const effectStack = createEffectStack();
 * // { stack: [], nextInstanceId: 0 }
 * ```
 */
export function createEffectStack(): EffectStackState {
  return {
    nextInstanceId: 0,
    stack: [],
  };
}

// ============================================================================
// ENQUEUE OPERATIONS
// ============================================================================

/**
 * Enqueues a single effect onto the stack
 *
 * Creates a new effect instance with a unique monotonic ID and adds it
 * to the end of the stack. The instance ID is generated using the
 * nextInstanceId counter, which increments after each use.
 *
 * @param draft - Immer draft state to mutate
 * @param sourceCardId - Card that generated this effect
 * @param effectRef - Reference to the effect definition
 * @param controllerId - Player controlling this effect
 * @returns The generated instance ID
 *
 * @example
 * ```typescript
 * const instanceId = enqueueEffect(draft, cardId, { effectId: "draw-2" }, playerId);
 * // Returns: "effect-0"
 * ```
 */
export function enqueueEffect(
  draft: GundamGameState,
  sourceCardId: CardId,
  effectRef: { effectId: string },
  controllerId: PlayerId,
): string {
  const instanceId = `effect-${draft.gundam.effectStack.nextInstanceId++}`;

  const instance: EffectInstance = {
    controllerId,
    currentActionIndex: 0,
    effectRef,
    instanceId,
    sourceCardId,
    state: "pending",
  };

  draft.gundam.effectStack.stack.push(instance);

  return instanceId;
}

/**
 * Enqueues multiple effects in a specified order
 *
 * When multiple effects trigger simultaneously, the active player chooses
 * the resolution order. This function accepts an array of effects and an
 * order array containing indices into the effects array.
 *
 * @param draft - Immer draft state to mutate
 * @param effects - Array of effects to enqueue
 * @param order - Array of indices specifying the order (must be valid indices)
 * @returns Array of instance IDs in the order they were enqueued
 * @throws Error if order contains invalid indices
 *
 * @example
 * ```typescript
 * const effects = [
 *   { sourceCardId: "card-1", effectRef: { effectId: "draw-1" }, controllerId: "p1" },
 *   { sourceCardId: "card-2", effectRef: { effectId: "damage-2" }, controllerId: "p1" },
 *   { sourceCardId: "card-3", effectRef: { effectId: "heal-1" }, controllerId: "p1" },
 * ];
 * // Enqueue in order: card-3, then card-1, then card-2
 * const instanceIds = enqueueBatchEffects(draft, effects, [2, 0, 1]);
 * // Returns: ["effect-0", "effect-1", "effect-2"]
 * ```
 */
export function enqueueBatchEffects(
  draft: GundamGameState,
  effects: {
    sourceCardId: CardId;
    effectRef: { effectId: string };
    controllerId: PlayerId;
  }[],
  order: number[],
): string[] {
  // Validate order indices
  for (const index of order) {
    if (index < 0 || index >= effects.length) {
      throw new Error(`Invalid order index ${index}: must be between 0 and ${effects.length - 1}`);
    }
  }

  const instanceIds: string[] = [];

  for (const index of order) {
    const effect = effects[index]!;
    const instanceId = enqueueEffect(
      draft,
      effect.sourceCardId,
      effect.effectRef,
      effect.controllerId,
    );
    instanceIds.push(instanceId);
  }

  return instanceIds;
}

// ============================================================================
// DEQUEUE OPERATIONS
// ============================================================================

/**
 * Dequeues the next effect from the front of the stack
 *
 * Removes and returns the first element from the stack using FIFO order.
 * Returns null if the stack is empty.
 *
 * @param draft - Immer draft state to mutate
 * @returns The dequeued effect instance, or null if stack is empty
 *
 * @example
 * ```typescript
 * const effect = dequeueEffect(draft);
 * if (effect) {
 *   // Process the effect
 * }
 * ```
 */
export function dequeueEffect(draft: GundamGameState): EffectInstance | null {
  const effect = draft.gundam.effectStack.stack.shift();
  return effect ?? null;
}

// ============================================================================
// STACK QUERY HELPERS
// ============================================================================

/**
 * Checks if the effect stack is empty
 *
 * Pure function that does not mutate state.
 *
 * @param state - Current game state (not draft)
 * @returns True if stack has no effects
 *
 * @example
 * ```typescript
 * if (isEffectStackEmpty(state)) {
 *   // No effects to resolve
 * }
 * ```
 */
export function isEffectStackEmpty(state: GundamGameState): boolean {
  return state.gundam.effectStack.stack.length === 0;
}

/**
 * Peeks at the next effect without removing it
 *
 * Pure function that does not mutate state. Returns the first element
 * of the stack (the one that will be dequeued next).
 *
 * @param state - Current game state (not draft)
 * @returns The next effect instance, or null if stack is empty
 *
 * @example
 * ```typescript
 * const nextEffect = peekNextEffect(state);
 * if (nextEffect) {
 *   console.log("Next effect:", nextEffect.effectRef.effectId);
 * }
 * ```
 */
export function peekNextEffect(state: GundamGameState): EffectInstance | null {
  return state.gundam.effectStack.stack[0] ?? null;
}

/**
 * Gets the current number of effects on the stack
 *
 * Pure function that does not mutate state.
 *
 * @param state - Current game state (not draft)
 * @returns Number of effects currently on the stack
 *
 * @example
 * ```typescript
 * const count = getEffectStackCount(state);
 * console.log(`There are ${count} effects waiting to resolve`);
 * ```
 */
export function getEffectStackCount(state: GundamGameState): number {
  return state.gundam.effectStack.stack.length;
}

// ============================================================================
// EFFECT INSTANCE LIFECYCLE HELPERS
// ============================================================================

/**
 * Marks an effect as resolving
 *
 * Updates the effect's state to "resolving" when it begins resolution.
 *
 * @param draft - Immer draft state to mutate
 * @param instanceId - Instance ID of the effect to update
 *
 * @example
 * ```typescript
 * markEffectResolving(draft, "effect-0");
 * ```
 */
export function markEffectResolving(draft: GundamGameState, instanceId: string): void {
  const instance = findEffectInstance(draft, instanceId);
  if (instance) {
    (instance as EffectInstance & { state: "resolving" }).state = "resolving";
  }
}

/**
 * Marks an effect as resolved
 *
 * Updates the effect's state to "resolved" when it completes successfully.
 *
 * @param draft - Immer draft state to mutate
 * @param instanceId - Instance ID of the effect to update
 *
 * @example
 * ```typescript
 * markEffectResolved(draft, "effect-0");
 * ```
 */
export function markEffectResolved(draft: GundamGameState, instanceId: string): void {
  const instance = findEffectInstance(draft, instanceId);
  if (instance) {
    (instance as EffectInstance & { state: "resolved" }).state = "resolved";
  }
}

/**
 * Marks an effect as fizzled
 *
 * Updates the effect's state to "fizzled" when it fails to resolve
 * (e.g., all targets became invalid).
 *
 * @param draft - Immer draft state to mutate
 * @param instanceId - Instance ID of the effect to update
 *
 * @example
 * ```typescript
 * markEffectFizzled(draft, "effect-0");
 * ```
 */
export function markEffectFizzled(draft: GundamGameState, instanceId: string): void {
  const instance = findEffectInstance(draft, instanceId);
  if (instance) {
    (instance as EffectInstance & { state: "fizzled" }).state = "fizzled";
  }
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Finds an effect instance in the stack by ID
 *
 * Pure function that does not mutate state. Searches the stack for
 * an effect with the matching instance ID.
 *
 * @param state - Current game state (not draft)
 * @param instanceId - Instance ID to search for
 * @returns The effect instance, or undefined if not found
 *
 * @example
 * ```typescript
 * const instance = findEffectInstance(state, "effect-0");
 * if (instance) {
 *   console.log("Found effect:", instance.effectRef.effectId);
 * }
 * ```
 */
export function findEffectInstance(
  state: GundamGameState,
  instanceId: string,
): EffectInstance | undefined {
  return state.gundam.effectStack.stack.find((effect) => effect.instanceId === instanceId);
}

/**
 * Updates an effect instance with partial changes
 *
 * Internal helper used by lifecycle helpers. Finds the effect instance
 * and applies partial updates to it.
 *
 * @param draft - Immer draft state to mutate
 * @param instanceId - Instance ID of the effect to update
 * @param updates - Partial updates to apply
 *
 * @example
 * ```typescript
 * updateEffectInstance(draft, "effect-0", { currentActionIndex: 2 });
 * ```
 */
export function updateEffectInstance(
  draft: GundamGameState,
  instanceId: string,
  updates: Partial<EffectInstance>,
): void {
  const instance = findEffectInstance(draft, instanceId);
  if (instance) {
    Object.assign(instance, updates);
  }
}

// ============================================================================
// EFFECT DEFINITION LOOKUP
// ============================================================================

/**
 * Temporary effect definition storage
 *
 * This is a placeholder for effect definitions.
 * In T5, this will be replaced with actual card definition lookups.
 *
 * For now, we store effect definitions here for testing and development.
 * The key format is "cardId:effectId".
 */
const EFFECT_DEFINITIONS: Record<string, EffectDefinition> = {};

/**
 * Registers an effect definition for a card
 *
 * This is used during game setup to register all effect definitions.
 * In production, this will be populated from card definitions.
 *
 * @param cardId - Card ID that owns this effect
 * @param effect - Effect definition to register
 */
export function registerEffectDefinition(cardId: CardId, effect: EffectDefinition): void {
  EFFECT_DEFINITIONS[`${cardId}:${effect.id}`] = effect;
}

/**
 * Gets an effect definition from a card
 *
 * Looks up the effect definition by card ID and effect ID.
 * Returns undefined if not found.
 *
 * @param state - Current game state
 * @param cardId - Card ID that owns the effect
 * @param effectId - Effect ID to look up
 * @returns Effect definition or undefined
 *
 * @example
 * ```typescript
 * const effect = getEffectDefinition(state, "card-1", "deploy-effect");
 * if (effect) {
 *   console.log(effect.actions);
 * }
 * ```
 */
export function getEffectDefinition(
  state: GundamGameState,
  cardId: CardId,
  effectId: string,
): EffectDefinition | undefined {
  return EFFECT_DEFINITIONS[`${cardId}:${effectId}`];
}

/**
 * Clears all registered effect definitions
 *
 * Used primarily for testing to reset state between tests.
 */
export function clearEffectDefinitions(): void {
  for (const key of Object.keys(EFFECT_DEFINITIONS)) {
    delete EFFECT_DEFINITIONS[key];
  }
}
