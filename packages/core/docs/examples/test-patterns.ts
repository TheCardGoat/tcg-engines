/**
 * Testing Patterns Examples
 *
 * Demonstrates testing utilities and TDD patterns from @tcg/core/testing
 * Run with: bun test packages/core/docs/examples/test-patterns.ts
 */

import { describe, expect, test } from "bun:test";
import {
  type CardId,
  createCardId,
  createPlayerId,
  createZone,
  createZoneId,
  draw,
  type GameDefinition,
  type GameMoveDefinitions,
  getZoneSize,
  moveCard,
  type Player,
  type PlayerId,
  RuleEngine,
  shuffle,
  type Zone,
} from "../../src";

import {
  createTestCard,
  createTestDeck,
  createTestEngine,
  createTestHand,
  createTestPlayers,
  expectDeterministicReplay,
  expectGameEnd,
  expectGameNotEnded,
  expectMoveFailure,
  expectMoveSuccess,
  expectPhaseTransition,
  expectStateProperty,
  withSeed,
} from "../../src/testing";

// =============================================================================
// Example Game Definition
// =============================================================================

type SimpleGameState = {
  players: Array<{
    id: PlayerId;
    name: string;
    hand: Zone;
    deck: Zone;
    graveyard: Zone;
    life: number;
  }>;
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "draw" | "main" | "end";
};

type SimpleGameMoves = {
  drawCard: Record<string, never>;
  playCard: { cardId: CardId };
  endPhase: Record<string, never>;
  dealDamage: { amount: number };
};

const simpleGameDefinition: GameDefinition<SimpleGameState, SimpleGameMoves> = {
  name: "Simple Card Game",

  setup: (players: Player[]) => ({
    players: players.map((p) => ({
      id: p.id,
      name: p.name || "Player",
      hand: createZone({
        id: createZoneId(`${p.id}-hand`),
        visibility: "owner",
        ordered: false,
      }),
      deck: shuffle(
        createZone(
          {
            id: createZoneId(`${p.id}-deck`),
            visibility: "secret",
            ordered: true,
          },
          Array.from({ length: 30 }, (_, i) =>
            createCardId(`${p.id}-card-${i + 1}`),
          ),
        ),
        `${p.id}-shuffle`,
      ),
      graveyard: createZone({
        id: createZoneId(`${p.id}-graveyard`),
        visibility: "public",
        ordered: false,
      }),
      life: 20,
    })),
    currentPlayerIndex: 0,
    turnNumber: 1,
    phase: "draw",
  }),

  moves: {
    drawCard: {
      condition: (state, context) => {
        const player = state.players.find((p) => p.id === context.playerId);
        return player !== undefined && state.phase === "draw";
      },
      reducer: (draft, context) => {
        const player = draft.players.find((p) => p.id === context.playerId);
        if (!player) return;

        if (getZoneSize(player.deck) === 0) {
          throw new Error("Cannot draw: deck is empty");
        }

        const { fromZone, toZone } = draw(player.deck, player.hand, 1);
        player.deck = fromZone;
        player.hand = toZone;
      },
    },

    playCard: {
      condition: (state, context) => {
        const player = state.players.find((p) => p.id === context.playerId);
        const cardId = context.data?.cardId as CardId;
        return (
          player !== undefined &&
          state.phase === "main" &&
          player.hand.cards.includes(cardId)
        );
      },
      reducer: (draft, context) => {
        const player = draft.players.find((p) => p.id === context.playerId);
        if (!player) return;

        const cardId = context.data?.cardId as CardId;
        const { fromZone, toZone } = moveCard(
          player.hand,
          player.graveyard,
          cardId,
        );
        player.hand = fromZone;
        player.graveyard = toZone;
      },
    },

    endPhase: {
      reducer: (draft) => {
        if (draft.phase === "draw") {
          draft.phase = "main";
        } else if (draft.phase === "main") {
          draft.phase = "end";
        } else {
          draft.phase = "draw";
          draft.currentPlayerIndex =
            (draft.currentPlayerIndex + 1) % draft.players.length;
          draft.turnNumber += 1;
        }
      },
    },

    dealDamage: {
      reducer: (draft, context) => {
        const amount = (context.data?.amount as number) || 0;
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const opponentIndex =
          (draft.currentPlayerIndex + 1) % draft.players.length;
        const opponent = draft.players[opponentIndex];
        if (opponent) {
          opponent.life -= amount;
        }
      },
    },
  },

  endIf: (state) => {
    const loser = state.players.find((p) => p.life <= 0);
    if (loser) {
      const winner = state.players.find((p) => p.id !== loser.id);
      return winner
        ? { winner: winner.id, reason: "Opponent life reached 0" }
        : undefined;
    }
    return undefined;
  },
};

// =============================================================================
// Example 1: Basic Move Testing
// =============================================================================

describe("Example 1: Basic Move Testing", () => {
  test("should draw card successfully", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Draw initial hand (7 cards)
    for (let i = 0; i < 7; i++) {
      expectMoveSuccess(engine, "drawCard", { playerId: players[0].id });
    }

    // Verify hand size
    expectStateProperty(engine, "players[0].hand.cards.length", 7);
  });

  test("should fail to draw when deck is empty", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Draw all 30 cards (initial hand + deck)
    for (let i = 0; i < 30; i++) {
      expectMoveSuccess(engine, "drawCard", { playerId: players[0].id });
    }

    // Verify deck is empty
    expectStateProperty(engine, "players[0].deck.cards.length", 0);

    // Try to draw from empty deck
    expectMoveFailure(engine, "drawCard", { playerId: players[0].id });
  });

  test("should fail to draw in wrong phase", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Move to main phase
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectStateProperty(engine, "phase", "main");

    // Try to draw in main phase (should fail condition)
    expectMoveFailure(engine, "drawCard", { playerId: players[0].id });
  });
});

// =============================================================================
// Example 2: State Property Testing
// =============================================================================

describe("Example 2: State Property Testing", () => {
  test("should verify nested properties", () => {
    const players = createTestPlayers(2, ["Alice", "Bob"]);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Simple properties
    expectStateProperty(engine, "turnNumber", 1);
    expectStateProperty(engine, "phase", "draw");
    expectStateProperty(engine, "currentPlayerIndex", 0);

    // Array indexing
    expectStateProperty(engine, "players[0].name", "Alice");
    expectStateProperty(engine, "players[1].name", "Bob");
    expectStateProperty(engine, "players[0].life", 20);
    expectStateProperty(engine, "players[1].life", 20);

    // Deeply nested
    expectStateProperty(engine, "players[0].hand.cards.length", 0);
    expectStateProperty(engine, "players[0].deck.cards.length", 30);
  });

  test("should track state changes", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Initial state
    expectStateProperty(engine, "players[0].hand.cards.length", 0);

    // Draw a card
    expectMoveSuccess(engine, "drawCard", { playerId: players[0].id });

    // Verify state changed
    expectStateProperty(engine, "players[0].hand.cards.length", 1);
    expectStateProperty(engine, "players[0].deck.cards.length", 29);
  });
});

// =============================================================================
// Example 3: Phase Transition Testing
// =============================================================================

describe("Example 3: Phase Transition Testing", () => {
  test("should transition through phases", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Initial phase
    expectStateProperty(engine, "phase", "draw");

    // Draw -> Main
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectStateProperty(engine, "phase", "main");

    // Main -> End
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectStateProperty(engine, "phase", "end");

    // End -> Draw (next turn)
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectStateProperty(engine, "phase", "draw");
    expectStateProperty(engine, "turnNumber", 2);
  });
});

// =============================================================================
// Example 4: Game End Testing
// =============================================================================

describe("Example 4: Game End Testing", () => {
  test("should end game when player life reaches 0", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Game should not be ended initially
    expectGameNotEnded(engine);

    // Deal 20 damage
    for (let i = 0; i < 20; i++) {
      expectMoveSuccess(engine, "dealDamage", {
        playerId: players[0].id,
        data: { amount: 1 },
      });
    }

    // Verify opponent life is 0
    expectStateProperty(engine, "players[1].life", 0);

    // Game should be ended
    expectGameEnd(engine, players[0].id);
  });

  test("should not end game if life is above 0", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "test",
    });

    // Deal 10 damage (not enough to kill)
    for (let i = 0; i < 10; i++) {
      expectMoveSuccess(engine, "dealDamage", {
        playerId: players[0].id,
        data: { amount: 1 },
      });
    }

    // Game should still be in progress
    expectGameNotEnded(engine);
    expectStateProperty(engine, "players[1].life", 10);
  });
});

// =============================================================================
// Example 5: Test Utilities - Factories
// =============================================================================

describe("Example 5: Test Utilities - Factories", () => {
  test("should create test cards", () => {
    const card1 = createTestCard({ name: "Dragon" });
    const card2 = createTestCard({ name: "Goblin", baseCost: 1 });

    expect(card1.name).toBe("Dragon");
    expect(card2.name).toBe("Goblin");
    expect(card2.baseCost).toBe(1);
  });

  test("should create test zones", () => {
    const deck = createTestDeck(
      [createCardId("card-1"), createCardId("card-2")],
      "p1",
    );
    const hand = createTestHand([createCardId("card-3")], "p1");

    expect(deck.cards.length).toBe(2);
    expect(hand.cards.length).toBe(1);
    expect(deck.config.visibility).toBe("secret");
    expect(hand.config.visibility).toBe("owner");
  });

  test("should create test players", () => {
    const players1 = createTestPlayers();
    expect(players1.length).toBe(2);
    expect(players1[0].name).toBe("Player 1");

    const players2 = createTestPlayers(4, ["Alice", "Bob"]);
    expect(players2.length).toBe(4);
    expect(players2[0].name).toBe("Alice");
    expect(players2[1].name).toBe("Bob");
    expect(players2[2].name).toBe("Player 3");
  });
});

// =============================================================================
// Example 6: Deterministic RNG Testing
// =============================================================================

describe("Example 6: Deterministic RNG Testing", () => {
  test("should produce deterministic results with same seed", () => {
    // Create two engines with same seed
    const players1 = createTestPlayers(2);
    const engine1 = new RuleEngine(simpleGameDefinition, players1, {
      seed: "test-seed",
    });

    const players2 = createTestPlayers(2);
    const engine2 = new RuleEngine(simpleGameDefinition, players2, {
      seed: "test-seed",
    });

    // Execute same moves on both
    expectMoveSuccess(engine1, "drawCard", { playerId: players1[0].id });
    expectMoveSuccess(engine2, "drawCard", { playerId: players2[0].id });

    // Should have identical states
    expect(engine1.getState()).toEqual(engine2.getState());
  });

  test("should use withSeed for deterministic operations", () => {
    const array = [1, 2, 3, 4, 5];

    // Same seed = same shuffle
    const shuffled1 = withSeed("shuffle-seed", (rng) =>
      rng.shuffle([...array]),
    );
    const shuffled2 = withSeed("shuffle-seed", (rng) =>
      rng.shuffle([...array]),
    );

    expect(shuffled1).toEqual(shuffled2);

    // Different seed = different shuffle
    const shuffled3 = withSeed("different-seed", (rng) =>
      rng.shuffle([...array]),
    );

    expect(shuffled1).not.toEqual(shuffled3);
  });
});

// =============================================================================
// Example 7: Replay Testing
// =============================================================================

describe("Example 7: Replay Testing", () => {
  test("should replay deterministically", () => {
    const players = createTestPlayers(2);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "replay-test",
    });

    // Execute several moves
    expectMoveSuccess(engine, "drawCard", { playerId: players[0].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });

    // Verify replay produces same state
    expectDeterministicReplay(engine);
  });
});

// =============================================================================
// Example 8: Integration Test
// =============================================================================

describe("Example 8: Complete Game Integration", () => {
  test("should play a full game", () => {
    const players = createTestPlayers(2, ["Alice", "Bob"]);
    const engine = new RuleEngine(simpleGameDefinition, players, {
      seed: "full-game",
    });

    // Initial state
    expectStateProperty(engine, "turnNumber", 1);
    expectStateProperty(engine, "players[0].name", "Alice");
    expectStateProperty(engine, "players[1].name", "Bob");
    expectGameNotEnded(engine);

    // Turn 1 - Alice
    expectMoveSuccess(engine, "drawCard", { playerId: players[0].id });
    expectStateProperty(engine, "players[0].hand.cards.length", 1);

    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectStateProperty(engine, "phase", "main");

    const card = engine.getState().players[0].hand.cards[0];
    expectMoveSuccess(engine, "playCard", {
      playerId: players[0].id,
      data: { cardId: card },
    });
    expectStateProperty(engine, "players[0].hand.cards.length", 0);
    expectStateProperty(engine, "players[0].graveyard.cards.length", 1);

    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[0].id });
    expectStateProperty(engine, "turnNumber", 2);
    expectStateProperty(engine, "currentPlayerIndex", 1);

    // Turn 2 - Bob
    expectMoveSuccess(engine, "drawCard", { playerId: players[1].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[1].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[1].id });
    expectMoveSuccess(engine, "endPhase", { playerId: players[1].id });
    expectStateProperty(engine, "turnNumber", 3);

    // Game should still be in progress
    expectGameNotEnded(engine);

    // Deal lethal damage
    for (let i = 0; i < 20; i++) {
      expectMoveSuccess(engine, "dealDamage", {
        playerId: players[0].id,
        data: { amount: 1 },
      });
    }

    // Game should end
    expectGameEnd(engine, players[0].id);

    // Verify replay
    expectDeterministicReplay(engine);
  });
});
