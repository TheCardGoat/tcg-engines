import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../../engine/rule-engine";
import type { GameDefinition } from "../../game-definition/game-definition";
import type { GameMoveDefinitions } from "../../game-definition/move-definitions";
import { createPlayerId, type PlayerId } from "../../types";
import {
  createTestCards,
  createTestDeck,
  createTestHand,
  expectDeterministicReplay,
  expectGameEnd,
  expectGameNotEnded,
  expectMoveFailure,
  expectMoveSuccess,
  expectPhaseTransition,
  expectStateProperty,
  withSeed,
} from "../index";

/**
 * Integration test demonstrating @tcg/core/testing utilities
 */

type TestGameState = {
  players: Array<{
    id: PlayerId;
    name: string;
    health: number;
    hand: string[];
  }>;
  phase: "draw" | "main";
  winner?: PlayerId;
};

type TestGameMoves = {
  drawCard: Record<string, never>;
  attack: Record<string, never>;
  endPhase: Record<string, never>;
};

describe("Testing Utilities Integration", () => {
  it("demonstrates testing utilities workflow", () => {
    // 1. Test factories
    const cards = createTestCards(5);
    expect(cards.length).toBe(5);

    const deck = createTestDeck([], createPlayerId("p1"));
    expect(deck.config.visibility).toBe("secret");

    const hand = createTestHand([], createPlayerId("p1"));
    expect(hand.config.visibility).toBe("private");

    // 2. Test RNG
    const shuffled1 = withSeed("test", (rng) => rng.shuffle([1, 2, 3]));
    const shuffled2 = withSeed("test", (rng) => rng.shuffle([1, 2, 3]));
    expect(shuffled1).toEqual(shuffled2);

    // 3. Test game
    const moves: GameMoveDefinitions<TestGameState, TestGameMoves> = {
      drawCard: {
        condition: (state) => state.phase === "draw",
        reducer: (draft) => {
          const player = draft.players[0];
          if (player) {
            player.hand.push("card");
          }
        },
      },
      attack: {
        condition: (state) => state.phase === "main",
        reducer: (draft) => {
          const target = draft.players[1];
          if (target) {
            target.health -= 1;
            if (target.health <= 0) {
              draft.winner = draft.players[0]?.id;
            }
          }
        },
      },
      endPhase: {
        reducer: (draft) => {
          draft.phase = draft.phase === "draw" ? "main" : "draw";
        },
      },
    };

    const gameDefinition: GameDefinition<TestGameState, TestGameMoves> = {
      name: "Test Game",
      setup: (players) => ({
        players: players.map((p) => ({
          id: p.id as PlayerId,
          name: p.name || "Player",
          health: 3,
          hand: [],
        })),
        phase: "draw" as const,
      }),
      moves,
      endIf: (state) => {
        if (state.winner) {
          return { winner: state.winner, reason: "Victory" };
        }
        return undefined;
      },
    };

    const engine = new RuleEngine(
      gameDefinition,
      [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ],
      { seed: "test-seed" },
    );

    // 4. Test assertions
    expectStateProperty(engine, "phase", "draw");
    expectStateProperty(engine, "players[0].health", 3);

    expectMoveSuccess(engine, "drawCard", {
      playerId: createPlayerId("p1"),
      params: {},
    });
    expectStateProperty(engine, "players[0].hand.length", 1);

    expectPhaseTransition(
      engine,
      "endPhase",
      { playerId: createPlayerId("p1"), params: {} },
      "draw",
      "main",
    );

    expectMoveFailure(
      engine,
      "drawCard",
      { playerId: createPlayerId("p1"), params: {} },
      "CONDITION_FAILED",
    );

    expectGameNotEnded(engine);

    // Attack to end game
    expectMoveSuccess(engine, "attack", {
      playerId: createPlayerId("p1"),
      params: {},
    });
    expectMoveSuccess(engine, "attack", {
      playerId: createPlayerId("p1"),
      params: {},
    });
    expectMoveSuccess(engine, "attack", {
      playerId: createPlayerId("p1"),
      params: {},
    });

    expectGameEnd(engine, createPlayerId("p1"));
    expectDeterministicReplay(engine);
  });
});
