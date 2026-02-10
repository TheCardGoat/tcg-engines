/**
 * Gundam Card Game - Effect Stack Tests
 *
 * Comprehensive tests for effect stack management including:
 * - Stack initialization
 * - Enqueue/dequeue operations
 * - Batch enqueue with ordering
 * - FIFO behavior verification
 * - Query helpers
 * - Lifecycle helpers
 * - Edge cases and integration scenarios
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import { produce } from "immer";
import type { GundamGameState } from "../../types";
import type { EffectAction } from "../../types/effects";
import {
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
} from "../effect-stack";

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Creates a minimal game state for testing
 */
function createTestGameState(): GundamGameState {
  const player1 = "player-1" as PlayerId;
  const player2 = "player-2" as PlayerId;

  return {
    players: [player1, player2],
    currentPlayer: player1,
    turn: 1,
    phase: "main",
    zones: {
      deck: {},
      resourceDeck: {},
      hand: {},
      battleArea: {},
      shieldSection: {},
      baseSection: {},
      resourceArea: {},
      trash: {},
      removal: {},
      limbo: {},
    },
    gundam: {
      activeResources: {},
      cardPositions: {},
      attackedThisTurn: [],
      hasPlayedResourceThisTurn: {},
      effectStack: createEffectStack(),
      temporaryModifiers: {},
      cardDamage: {},
      revealedCards: [],
    },
  };
}

/**
 * Creates a test card ID
 */
function createTestCardId(index: number): CardId {
  return `card-${index}` as CardId;
}

/**
 * Creates a test player ID
 */
function createTestPlayerId(index: number): PlayerId {
  return `player-${index}` as PlayerId;
}

// ============================================================================
// STACK INITIALIZATION TESTS
// ============================================================================

describe("Effect Stack - Initialization", () => {
  it("should create an empty stack", () => {
    const stack = createEffectStack();
    expect(stack.stack).toEqual([]);
    expect(stack.nextInstanceId).toBe(0);
  });

  it("should initialize game state with empty effect stack", () => {
    const state = createTestGameState();
    expect(state.gundam.effectStack.stack).toEqual([]);
    expect(state.gundam.effectStack.nextInstanceId).toBe(0);
  });
});

// ============================================================================
// ENQUEUE TESTS
// ============================================================================

describe("Effect Stack - Enqueue", () => {
  it("should enqueue a single effect and increment nextInstanceId", () => {
    let state = createTestGameState();
    const cardId: CardId = createTestCardId(1);
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      const instanceId = enqueueEffect(
        draft,
        cardId,
        { effectId: "draw-2" },
        playerId,
      );

      expect(instanceId).toBe("effect-0");
      expect(draft.gundam.effectStack.stack).toHaveLength(1);
      expect(draft.gundam.effectStack.nextInstanceId).toBe(1);
    });

    // Verify the effect was created correctly
    const effect = state.gundam.effectStack.stack[0];
    expect(effect?.instanceId).toBe("effect-0");
    expect(effect?.sourceCardId).toBe("card-1");
    expect(effect?.effectRef.effectId).toBe("draw-2");
    expect(effect?.controllerId).toBe("player-1");
    expect(effect?.currentActionIndex).toBe(0);
    expect(effect?.state).toBe("pending");
  });

  it("should generate unique instance IDs for multiple enqueues", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      for (let i = 0; i < 3; i++) {
        const cardId: CardId = createTestCardId(i);
        enqueueEffect(draft, cardId, { effectId: `effect-${i}` }, playerId);
      }
    });

    expect(state.gundam.effectStack.stack[0]?.instanceId).toBe("effect-0");
    expect(state.gundam.effectStack.stack[1]?.instanceId).toBe("effect-1");
    expect(state.gundam.effectStack.stack[2]?.instanceId).toBe("effect-2");
    expect(state.gundam.effectStack.stack).toHaveLength(3);
    expect(state.gundam.effectStack.nextInstanceId).toBe(3);
  });

  it("should add effects to the end of the stack (FIFO)", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(
        draft,
        createTestCardId(1),
        { effectId: "first" },
        playerId,
      );
      enqueueEffect(
        draft,
        createTestCardId(2),
        { effectId: "second" },
        playerId,
      );
      enqueueEffect(
        draft,
        createTestCardId(3),
        { effectId: "third" },
        playerId,
      );
    });

    expect(state.gundam.effectStack.stack[0]?.effectRef.effectId).toBe("first");
    expect(state.gundam.effectStack.stack[1]?.effectRef.effectId).toBe(
      "second",
    );
    expect(state.gundam.effectStack.stack[2]?.effectRef.effectId).toBe("third");
  });

  it("should initialize effect with pending state", () => {
    let state = createTestGameState();

    state = produce(state, (draft) => {
      enqueueEffect(
        draft,
        createTestCardId(1),
        { effectId: "test-effect" },
        createTestPlayerId(1),
      );
    });

    const effect = state.gundam.effectStack.stack[0];
    expect(effect?.state).toBe("pending");
  });
});

// ============================================================================
// BATCH ENQUEUE TESTS
// ============================================================================

describe("Effect Stack - Batch Enqueue", () => {
  it("should enqueue effects in specified order", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    const effects = [
      {
        sourceCardId: createTestCardId(1),
        effectRef: { effectId: "first" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(2),
        effectRef: { effectId: "second" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(3),
        effectRef: { effectId: "third" } as const,
        controllerId: playerId,
      },
    ];

    state = produce(state, (draft) => {
      const instanceIds = enqueueBatchEffects(draft, effects, [2, 0, 1]);
      expect(instanceIds).toEqual(["effect-0", "effect-1", "effect-2"]);
    });

    // Verify order: third (index 2), first (index 0), second (index 1)
    expect(state.gundam.effectStack.stack[0]?.effectRef.effectId).toBe("third");
    expect(state.gundam.effectStack.stack[1]?.effectRef.effectId).toBe("first");
    expect(state.gundam.effectStack.stack[2]?.effectRef.effectId).toBe(
      "second",
    );
  });

  it("should handle different orderings", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    const effects = [
      {
        sourceCardId: createTestCardId(1),
        effectRef: { effectId: "A" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(2),
        effectRef: { effectId: "B" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(3),
        effectRef: { effectId: "C" } as const,
        controllerId: playerId,
      },
    ];

    // Test ordering [1, 2, 0] -> B, C, A
    state = produce(state, (draft) => {
      enqueueBatchEffects(draft, effects, [1, 2, 0]);
    });

    expect(state.gundam.effectStack.stack[0]?.effectRef.effectId).toBe("B");
    expect(state.gundam.effectStack.stack[1]?.effectRef.effectId).toBe("C");
    expect(state.gundam.effectStack.stack[2]?.effectRef.effectId).toBe("A");
  });

  it("should assign unique instance IDs in batch enqueue", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    const effects = [
      {
        sourceCardId: createTestCardId(1),
        effectRef: { effectId: "A" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(2),
        effectRef: { effectId: "B" } as const,
        controllerId: playerId,
      },
    ];

    state = produce(state, (draft) => {
      const instanceIds = enqueueBatchEffects(draft, effects, [0, 1]);
      expect(instanceIds).toEqual(["effect-0", "effect-1"]);
    });

    expect(state.gundam.effectStack.stack[0]?.instanceId).toBe("effect-0");
    expect(state.gundam.effectStack.stack[1]?.instanceId).toBe("effect-1");
  });

  it("should handle empty batch", () => {
    let state = createTestGameState();

    state = produce(state, (draft) => {
      const instanceIds = enqueueBatchEffects(draft, [], []);
      expect(instanceIds).toEqual([]);
    });

    expect(state.gundam.effectStack.stack).toHaveLength(0);
  });

  it("should throw error for invalid order indices", () => {
    const state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    const effects = [
      {
        sourceCardId: createTestCardId(1),
        effectRef: { effectId: "A" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(2),
        effectRef: { effectId: "B" } as const,
        controllerId: playerId,
      },
    ];

    expect(() => {
      produce(state, (draft) => {
        enqueueBatchEffects(draft, effects, [0, 5]); // 5 is out of bounds
      });
    }).toThrow("Invalid order index 5");
  });

  it("should throw error for negative order indices", () => {
    const state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    const effects = [
      {
        sourceCardId: createTestCardId(1),
        effectRef: { effectId: "A" } as const,
        controllerId: playerId,
      },
    ];

    expect(() => {
      produce(state, (draft) => {
        enqueueBatchEffects(draft, effects, [-1]);
      });
    }).toThrow("Invalid order index -1");
  });
});

// ============================================================================
// DEQUEUE TESTS
// ============================================================================

describe("Effect Stack - Dequeue", () => {
  it("should dequeue from front of stack (FIFO)", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    // Enqueue three effects
    state = produce(state, (draft) => {
      enqueueEffect(
        draft,
        createTestCardId(1),
        { effectId: "first" },
        playerId,
      );
      enqueueEffect(
        draft,
        createTestCardId(2),
        { effectId: "second" },
        playerId,
      );
      enqueueEffect(
        draft,
        createTestCardId(3),
        { effectId: "third" },
        playerId,
      );
    });

    expect(state.gundam.effectStack.stack).toHaveLength(3);

    // Get first effect before dequeue
    const firstEffect = state.gundam.effectStack.stack[0];

    // Dequeue should remove from front
    state = produce(state, (draft) => {
      dequeueEffect(draft);
    });

    expect(firstEffect?.effectRef.effectId).toBe("first");
    expect(state.gundam.effectStack.stack).toHaveLength(2);
    expect(state.gundam.effectStack.stack[0]?.effectRef.effectId).toBe(
      "second",
    );
  });

  it("should return null when dequeuing empty stack", () => {
    let state = createTestGameState();

    state = produce(state, (draft) => {
      const result = dequeueEffect(draft);
      expect(result).toBeNull();
    });

    expect(state.gundam.effectStack.stack).toHaveLength(0);
  });

  it("should return correct effect instance", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);
    const cardId: CardId = createTestCardId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, cardId, { effectId: "test-effect" }, playerId);
    });

    // Get the effect before dequeue
    const effectBefore = state.gundam.effectStack.stack[0];

    state = produce(state, (draft) => {
      const dequeued = dequeueEffect(draft);
      expect(dequeued).not.toBeNull();
      expect(dequeued?.instanceId).toBe("effect-0");
      expect(dequeued?.sourceCardId).toBe(cardId);
      expect(dequeued?.effectRef.effectId).toBe("test-effect");
      expect(dequeued?.controllerId).toBe(playerId);
      expect(dequeued?.currentActionIndex).toBe(0);
      expect(dequeued?.state).toBe("pending");
    });

    // Verify it was dequeued
    expect(state.gundam.effectStack.stack).toHaveLength(0);
    expect(effectBefore?.instanceId).toBe("effect-0");
  });

  it("should decrease stack size after dequeue", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      for (let i = 0; i < 5; i++) {
        enqueueEffect(
          draft,
          createTestCardId(i),
          { effectId: `effect-${i}` },
          playerId,
        );
      }
    });

    expect(state.gundam.effectStack.stack).toHaveLength(5);

    state = produce(state, (draft) => {
      dequeueEffect(draft);
    });

    expect(state.gundam.effectStack.stack).toHaveLength(4);

    state = produce(state, (draft) => {
      dequeueEffect(draft);
      dequeueEffect(draft);
    });

    expect(state.gundam.effectStack.stack).toHaveLength(2);
  });
});

// ============================================================================
// FIFO BEHAVIOR TESTS
// ============================================================================

describe("Effect Stack - FIFO Behavior", () => {
  it("should process effects in FIFO order", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    // Enqueue A, B, C
    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "A" }, playerId);
      enqueueEffect(draft, createTestCardId(2), { effectId: "B" }, playerId);
      enqueueEffect(draft, createTestCardId(3), { effectId: "C" }, playerId);
    });

    // Collect effects before dequeuing
    const effectA = state.gundam.effectStack.stack[0];
    const effectB = state.gundam.effectStack.stack[1];
    const effectC = state.gundam.effectStack.stack[2];

    // Dequeue all three
    state = produce(state, (draft) => {
      dequeueEffect(draft);
      dequeueEffect(draft);
      dequeueEffect(draft);
    });

    expect(effectA?.effectRef.effectId).toBe("A");
    expect(effectB?.effectRef.effectId).toBe("B");
    expect(effectC?.effectRef.effectId).toBe("C");
    expect(state.gundam.effectStack.stack).toHaveLength(0);
  });

  it("should maintain order through multiple enqueue/dequeue cycles", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    // First cycle: enqueue A, B
    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "A" }, playerId);
      enqueueEffect(draft, createTestCardId(2), { effectId: "B" }, playerId);
    });

    // Get effect A before dequeue
    const effectA = state.gundam.effectStack.stack[0];

    // Dequeue A
    state = produce(state, (draft) => {
      const dequeued = dequeueEffect(draft);
      expect(dequeued?.effectRef.effectId).toBe("A");
    });

    expect(effectA?.effectRef.effectId).toBe("A");

    // Enqueue C
    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(3), { effectId: "C" }, playerId);
    });

    // Stack should now have B, C (in that order)
    expect(state.gundam.effectStack.stack[0]?.effectRef.effectId).toBe("B");
    expect(state.gundam.effectStack.stack[1]?.effectRef.effectId).toBe("C");

    // Get B and C before dequeuing
    const effectB = state.gundam.effectStack.stack[0];
    const effectC = state.gundam.effectStack.stack[1];

    // Dequeue B, then C
    state = produce(state, (draft) => {
      dequeueEffect(draft);
      dequeueEffect(draft);
    });

    expect(effectB?.effectRef.effectId).toBe("B");
    expect(effectC?.effectRef.effectId).toBe("C");
    expect(state.gundam.effectStack.stack).toHaveLength(0);
  });
});

// ============================================================================
// QUERY HELPER TESTS
// ============================================================================

describe("Effect Stack - Query Helpers", () => {
  it("should report empty when stack is empty", () => {
    const state = createTestGameState();
    expect(isEffectStackEmpty(state)).toBe(true);
  });

  it("should report not empty when stack has effects", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "test" }, playerId);
    });

    expect(isEffectStackEmpty(state)).toBe(false);
  });

  it("should peek at next effect without removing", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(
        draft,
        createTestCardId(1),
        { effectId: "first" },
        playerId,
      );
      enqueueEffect(
        draft,
        createTestCardId(2),
        { effectId: "second" },
        playerId,
      );
    });

    const peeked = peekNextEffect(state);
    expect(peeked?.effectRef.effectId).toBe("first");

    // Stack should still have both effects
    expect(state.gundam.effectStack.stack).toHaveLength(2);
    expect(state.gundam.effectStack.stack[0]?.effectRef.effectId).toBe("first");
  });

  it("should return null when peeking empty stack", () => {
    const state = createTestGameState();
    expect(peekNextEffect(state)).toBeNull();
  });

  it("should return correct stack count", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    expect(getEffectStackCount(state)).toBe(0);

    state = produce(state, (draft) => {
      for (let i = 0; i < 3; i++) {
        enqueueEffect(
          draft,
          createTestCardId(i),
          { effectId: `effect-${i}` },
          playerId,
        );
      }
    });

    expect(getEffectStackCount(state)).toBe(3);
  });

  it("should not mutate state in query helpers", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "test" }, playerId);
    });

    const originalStack = state.gundam.effectStack.stack;
    const originalCount = state.gundam.effectStack.nextInstanceId;

    // Call query helpers
    isEffectStackEmpty(state);
    peekNextEffect(state);
    getEffectStackCount(state);

    // State should be unchanged
    expect(state.gundam.effectStack.stack).toBe(originalStack);
    expect(state.gundam.effectStack.nextInstanceId).toBe(originalCount);
  });
});

// ============================================================================
// LIFECYCLE HELPER TESTS
// ============================================================================

describe("Effect Stack - Lifecycle Helpers", () => {
  it("should mark effect as resolving", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "test" }, playerId);
    });

    state = produce(state, (draft) => {
      markEffectResolving(draft, "effect-0");
    });

    const effect = findEffectInstance(state, "effect-0");
    expect(effect?.state).toBe("resolving");
  });

  it("should mark effect as resolved", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "test" }, playerId);
    });

    state = produce(state, (draft) => {
      markEffectResolved(draft, "effect-0");
    });

    const effect = findEffectInstance(state, "effect-0");
    expect(effect?.state).toBe("resolved");
  });

  it("should mark effect as fizzled", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "test" }, playerId);
    });

    state = produce(state, (draft) => {
      markEffectFizzled(draft, "effect-0");
    });

    const effect = findEffectInstance(state, "effect-0");
    expect(effect?.state).toBe("fizzled");
  });

  it("should handle lifecycle transitions", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "test" }, playerId);
    });

    // pending -> resolving -> resolved
    let effect = findEffectInstance(state, "effect-0");
    expect(effect?.state).toBe("pending");

    state = produce(state, (draft) => {
      markEffectResolving(draft, "effect-0");
    });
    effect = findEffectInstance(state, "effect-0");
    expect(effect?.state).toBe("resolving");

    state = produce(state, (draft) => {
      markEffectResolved(draft, "effect-0");
    });
    effect = findEffectInstance(state, "effect-0");
    expect(effect?.state).toBe("resolved");
  });

  it("should handle non-existent instance ID gracefully", () => {
    let state = createTestGameState();

    // These should not throw
    state = produce(state, (draft) => {
      markEffectResolving(draft, "non-existent");
      markEffectResolved(draft, "non-existent");
      markEffectFizzled(draft, "non-existent");
    });

    // State should be unchanged
    expect(state.gundam.effectStack.stack).toHaveLength(0);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe("Effect Stack - Integration Tests", () => {
  it("should handle complex scenario: enqueue, mark, dequeue", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    // Enqueue multiple effects
    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "A" }, playerId);
      enqueueEffect(draft, createTestCardId(2), { effectId: "B" }, playerId);
      enqueueEffect(draft, createTestCardId(3), { effectId: "C" }, playerId);
    });

    expect(state.gundam.effectStack.stack).toHaveLength(3);

    // Mark first effect as resolving
    state = produce(state, (draft) => {
      markEffectResolving(draft, "effect-0");
    });

    expect(state.gundam.effectStack.stack[0]?.state).toBe("resolving");

    // Get first effect before dequeue
    const firstEffect = state.gundam.effectStack.stack[0];

    // Dequeue first effect
    state = produce(state, (draft) => {
      dequeueEffect(draft);
    });

    expect(firstEffect?.state).toBe("resolving");
    expect(state.gundam.effectStack.stack).toHaveLength(2);

    // Mark second as fizzled
    state = produce(state, (draft) => {
      markEffectFizzled(draft, "effect-1");
    });

    expect(state.gundam.effectStack.stack[0]?.state).toBe("fizzled");

    // Get second effect before dequeue
    const secondEffect = state.gundam.effectStack.stack[0];

    // Dequeue it
    state = produce(state, (draft) => {
      dequeueEffect(draft);
    });

    expect(secondEffect?.state).toBe("fizzled");
    expect(state.gundam.effectStack.stack).toHaveLength(1);
  });

  it("should handle batch ordering with active player choice", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    // Simultaneous triggers from 3 cards
    const effects = [
      {
        sourceCardId: createTestCardId(1),
        effectRef: { effectId: "draw" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(2),
        effectRef: { effectId: "damage" } as const,
        controllerId: playerId,
      },
      {
        sourceCardId: createTestCardId(3),
        effectRef: { effectId: "heal" } as const,
        controllerId: playerId,
      },
    ];

    // Active player chooses order: damage, heal, draw
    state = produce(state, (draft) => {
      enqueueBatchEffects(draft, effects, [1, 2, 0]);
    });

    // Collect effects before dequeue
    const effect1 = state.gundam.effectStack.stack[0];
    const effect2 = state.gundam.effectStack.stack[1];
    const effect3 = state.gundam.effectStack.stack[2];

    // Dequeue all
    state = produce(state, (draft) => {
      dequeueEffect(draft);
      dequeueEffect(draft);
      dequeueEffect(draft);
    });

    // Verify order was damage, heal, draw
    expect(effect1?.effectRef.effectId).toBe("damage");
    expect(effect2?.effectRef.effectId).toBe("heal");
    expect(effect3?.effectRef.effectId).toBe("draw");
  });

  it("should maintain monotonic ID generation across operations", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    // First batch
    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(1), { effectId: "A" }, playerId);
      enqueueEffect(draft, createTestCardId(2), { effectId: "B" }, playerId);
    });

    expect(state.gundam.effectStack.nextInstanceId).toBe(2);

    // Dequeue one
    state = produce(state, (draft) => {
      dequeueEffect(draft);
    });

    // Add more
    state = produce(state, (draft) => {
      enqueueEffect(draft, createTestCardId(3), { effectId: "C" }, playerId);
      enqueueEffect(draft, createTestCardId(4), { effectId: "D" }, playerId);
    });

    // IDs should continue from where they left off
    expect(state.gundam.effectStack.stack[0]?.instanceId).toBe("effect-1");
    expect(state.gundam.effectStack.stack[1]?.instanceId).toBe("effect-2");
    expect(state.gundam.effectStack.stack[2]?.instanceId).toBe("effect-3");
    expect(state.gundam.effectStack.nextInstanceId).toBe(4);
  });

  it("should handle empty stack after dequeuing all effects", () => {
    let state = createTestGameState();
    const playerId: PlayerId = createTestPlayerId(1);

    state = produce(state, (draft) => {
      for (let i = 0; i < 3; i++) {
        enqueueEffect(
          draft,
          createTestCardId(i),
          { effectId: `effect-${i}` },
          playerId,
        );
      }
    });

    expect(isEffectStackEmpty(state)).toBe(false);

    state = produce(state, (draft) => {
      dequeueEffect(draft);
      dequeueEffect(draft);
      dequeueEffect(draft);
    });

    expect(isEffectStackEmpty(state)).toBe(true);
    expect(peekNextEffect(state)).toBeNull();
    expect(getEffectStackCount(state)).toBe(0);
  });
});

// ============================================================================
// EFFECT DEFINITION LOOKUP TESTS
// ============================================================================

describe("Effect Stack - Effect Definition Lookup", () => {
  beforeEach(() => {
    // Clear all effect definitions before each test
    clearEffectDefinitions();
  });

  it("should register and retrieve effect definition", () => {
    const cardId: CardId = createTestCardId(1);
    const effectDefinition = {
      id: "draw-2",
      category: "command" as const,
      timing: { type: "MAIN" as const },
      actions: [
        { type: "DRAW", count: 2, player: "self" as const },
      ] as EffectAction[],
      text: "Draw 2 cards.",
    };

    registerEffectDefinition(cardId, effectDefinition);

    const state = createTestGameState();
    const retrieved = getEffectDefinition(state, cardId, "draw-2");

    expect(retrieved).toEqual(effectDefinition);
    expect(retrieved?.actions).toHaveLength(1);
    expect(retrieved?.actions[0]).toEqual({
      type: "DRAW",
      count: 2,
      player: "self",
    });
  });

  it("should return undefined for non-existent effect", () => {
    const state = createTestGameState();
    const result = getEffectDefinition(
      state,
      createTestCardId(1),
      "non-existent",
    );

    expect(result).toBeUndefined();
  });

  it("should register multiple effect definitions for same card", () => {
    const cardId: CardId = createTestCardId(1);

    registerEffectDefinition(cardId, {
      id: "effect-1",
      category: "triggered" as const,
      timing: { type: "DEPLOY" as const },
      actions: [
        { type: "DRAW", count: 1, player: "self" as const },
      ] as EffectAction[],
      text: "Draw 1 card.",
    });

    registerEffectDefinition(cardId, {
      id: "effect-2",
      category: "triggered" as const,
      timing: { type: "DESTROYED" as const },
      actions: [
        {
          type: "DAMAGE",
          amount: 2,
          target: "unit" as const,
          damageType: "effect" as const,
        },
      ] as EffectAction[],
      text: "Deal 2 damage.",
    });

    const state = createTestGameState();
    const effect1 = getEffectDefinition(state, cardId, "effect-1");
    const effect2 = getEffectDefinition(state, cardId, "effect-2");

    expect(effect1?.id).toBe("effect-1");
    expect(effect2?.id).toBe("effect-2");
    expect(effect1?.actions).toHaveLength(1);
    expect(effect2?.actions).toHaveLength(1);
  });

  it("should clear all effect definitions", () => {
    const cardId: CardId = createTestCardId(1);

    registerEffectDefinition(cardId, {
      id: "test-effect",
      category: "command" as const,
      timing: { type: "MAIN" as const },
      actions: [],
      text: "Test",
    });

    const state = createTestGameState();
    expect(getEffectDefinition(state, cardId, "test-effect")).toBeDefined();

    clearEffectDefinitions();
    expect(getEffectDefinition(state, cardId, "test-effect")).toBeUndefined();
  });

  it("should store effect definitions independently from game state", () => {
    const cardId: CardId = createTestCardId(1);
    const effectDefinition = {
      id: "test",
      category: "command" as const,
      timing: { type: "MAIN" as const },
      actions: [
        { type: "DRAW", count: 1, player: "self" as const },
      ] as EffectAction[],
      text: "Test",
    };

    registerEffectDefinition(cardId, effectDefinition);

    // Create two different game states
    const state1 = createTestGameState();
    const state2 = createTestGameState();

    // Both should be able to retrieve the same effect definition
    expect(getEffectDefinition(state1, cardId, "test")).toEqual(
      effectDefinition,
    );
    expect(getEffectDefinition(state2, cardId, "test")).toEqual(
      effectDefinition,
    );
  });
});
