import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../engine/rule-engine";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId, type PlayerId } from "../types";
import { expectDeterministicReplay } from "./test-replay-assertions";

/**
 * Test state for replay assertions
 */
type ReplayTestState = {
  players: Array<{
    id: PlayerId;
    name: string;
    score: number;
  }>;
  turnNumber: number;
  randomValues: number[];
};

type ReplayTestMoves = {
  addRandom: Record<string, never>;
  incrementScore: { amount: number };
};

describe("test-replay-assertions", () => {
  function createTestEngine(seed?: string) {
    const moves: GameMoveDefinitions<ReplayTestState, ReplayTestMoves> = {
      addRandom: {
        reducer: (draft, context) => {
          // Use RNG to add random value
          const value = context.rng?.randomInt(1, 100) ?? 0;
          draft.randomValues.push(value);
        },
      },
      incrementScore: {
        reducer: (draft, context) => {
          const player = draft.players.find((p) => p.id === context.playerId);
          if (player && context.data?.amount) {
            player.score += context.data.amount as number;
          }
        },
      },
    };

    const gameDefinition: GameDefinition<ReplayTestState, ReplayTestMoves> = {
      name: "Replay Test Game",
      setup: (players) => ({
        players: players.map((p) => ({
          id: p.id as PlayerId,
          name: p.name || "Player",
          score: 0,
        })),
        turnNumber: 1,
        randomValues: [],
      }),
      moves,
    };

    const players = [
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ];

    return new RuleEngine(gameDefinition, players, { seed });
  }

  describe("expectDeterministicReplay", () => {
    it("should pass when replay produces same state", () => {
      const engine = createTestEngine("replay-seed");

      // Execute some moves
      engine.executeMove("incrementScore", {
        playerId: createPlayerId("p1"),
        data: { amount: 5 },
      });
      engine.executeMove("addRandom", {
        playerId: createPlayerId("p1"),
      });
      engine.executeMove("incrementScore", {
        playerId: createPlayerId("p2"),
        data: { amount: 3 },
      });

      // Should not throw
      expectDeterministicReplay(engine);
    });

    it("should verify replay with RNG operations", () => {
      const engine = createTestEngine("rng-replay-seed");

      // Execute moves that use RNG
      for (let i = 0; i < 10; i++) {
        engine.executeMove("addRandom", {
          playerId: createPlayerId("p1"),
        });
      }

      // Replay should produce exact same random values
      expectDeterministicReplay(engine);
    });

    it("should work with complex move sequences", () => {
      const engine = createTestEngine("complex-replay");

      // Complex sequence
      engine.executeMove("incrementScore", {
        playerId: createPlayerId("p1"),
        data: { amount: 1 },
      });
      engine.executeMove("addRandom", {
        playerId: createPlayerId("p1"),
      });
      engine.executeMove("incrementScore", {
        playerId: createPlayerId("p2"),
        data: { amount: 2 },
      });
      engine.executeMove("addRandom", {
        playerId: createPlayerId("p2"),
      });
      engine.executeMove("incrementScore", {
        playerId: createPlayerId("p1"),
        data: { amount: 3 },
      });

      expectDeterministicReplay(engine);
    });

    it("should detect non-deterministic behavior", () => {
      // Create engine with non-deterministic move
      let callCount = 0;
      const moves: GameMoveDefinitions<ReplayTestState, ReplayTestMoves> = {
        addRandom: {
          reducer: (draft) => {
            // Add non-deterministic behavior
            callCount++;
            draft.randomValues.push(callCount); // Different each time
          },
        },
        incrementScore: {
          reducer: () => {},
        },
      };

      const gameDefinition: GameDefinition<ReplayTestState, ReplayTestMoves> = {
        name: "Non-deterministic Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          turnNumber: 1,
          randomValues: [],
        }),
        moves,
      };

      const engine = new RuleEngine(
        gameDefinition,
        [{ id: createPlayerId("p1"), name: "Alice" }],
        { seed: "non-deterministic" },
      );

      engine.executeMove("addRandom", { playerId: createPlayerId("p1") });

      // Should throw because replay will have different state
      expect(() => {
        expectDeterministicReplay(engine);
      }).toThrow(/Replay produced different state/);
    });

    it("should work with empty history", () => {
      const engine = createTestEngine("empty-seed");

      // No moves executed
      expectDeterministicReplay(engine);
    });

    it("should work with single move", () => {
      const engine = createTestEngine("single-move");

      engine.executeMove("incrementScore", {
        playerId: createPlayerId("p1"),
        data: { amount: 10 },
      });

      expectDeterministicReplay(engine);
    });

    it("should provide helpful error message on mismatch", () => {
      // Create problematic engine
      let isReplay = false;
      const moves: GameMoveDefinitions<ReplayTestState, ReplayTestMoves> = {
        addRandom: {
          reducer: (draft, context) => {
            if (isReplay) {
              // Different behavior on replay
              draft.randomValues.push(999);
            } else {
              const value = context.rng?.randomInt(1, 100) ?? 0;
              draft.randomValues.push(value);
              isReplay = true; // Flag for next call
            }
          },
        },
        incrementScore: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<ReplayTestState, ReplayTestMoves> = {
        name: "Mismatch Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          turnNumber: 1,
          randomValues: [],
        }),
        moves,
      };

      const engine = new RuleEngine(
        gameDefinition,
        [{ id: createPlayerId("p1"), name: "Alice" }],
        { seed: "mismatch" },
      );

      engine.executeMove("addRandom", { playerId: createPlayerId("p1") });

      expect(() => {
        expectDeterministicReplay(engine);
      }).toThrow(/Replay produced different state/);
    });
  });

  describe("integration with real game scenarios", () => {
    it("should verify card shuffling is deterministic", () => {
      type CardGameState = {
        players: Array<{ id: PlayerId; name: string }>;
        deck: string[];
      };

      type CardMoves = {
        shuffle: Record<string, never>;
      };

      const moves: GameMoveDefinitions<CardGameState, CardMoves> = {
        shuffle: {
          reducer: (draft, context) => {
            if (context.rng) {
              draft.deck = context.rng.shuffle(draft.deck);
            }
          },
        },
      };

      const gameDefinition: GameDefinition<CardGameState, CardMoves> = {
        name: "Card Shuffle Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          deck: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        }),
        moves,
      };

      const engine = new RuleEngine(
        gameDefinition,
        [{ id: createPlayerId("p1"), name: "Alice" }],
        { seed: "shuffle-test" },
      );

      // Shuffle multiple times
      engine.executeMove("shuffle", { playerId: createPlayerId("p1") });
      engine.executeMove("shuffle", { playerId: createPlayerId("p1") });
      engine.executeMove("shuffle", { playerId: createPlayerId("p1") });

      // Replay should produce same sequence of shuffles
      expectDeterministicReplay(engine);
    });

    it("should verify dice rolls are deterministic", () => {
      type DiceGameState = {
        players: Array<{ id: PlayerId; name: string }>;
        rolls: number[];
      };

      type DiceMoves = {
        roll: Record<string, never>;
      };

      const moves: GameMoveDefinitions<DiceGameState, DiceMoves> = {
        roll: {
          reducer: (draft, context) => {
            if (context.rng) {
              const roll = context.rng.rollDice(20) as number;
              draft.rolls.push(roll);
            }
          },
        },
      };

      const gameDefinition: GameDefinition<DiceGameState, DiceMoves> = {
        name: "Dice Roll Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          rolls: [],
        }),
        moves,
      };

      const engine = new RuleEngine(
        gameDefinition,
        [{ id: createPlayerId("p1"), name: "Alice" }],
        { seed: "dice-test" },
      );

      // Roll dice multiple times
      for (let i = 0; i < 20; i++) {
        engine.executeMove("roll", { playerId: createPlayerId("p1") });
      }

      // Replay should produce same dice rolls
      expectDeterministicReplay(engine);
    });
  });
});
