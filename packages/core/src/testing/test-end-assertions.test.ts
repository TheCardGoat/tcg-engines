import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../engine/rule-engine";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { type PlayerId, createPlayerId } from "../types";
import { expectGameEnd, expectGameNotEnded } from "./test-end-assertions";

/**
 * Test state for end assertions
 */
interface EndTestState {
  players: {
    id: PlayerId;
    name: string;
    health: number;
  }[];
  turnNumber: number;
  winner?: PlayerId;
}

interface EndTestMoves {
  damagePlayer: { targetId: PlayerId; amount: number };
  setWinner: { winnerId: PlayerId };
}

describe("test-end-assertions", () => {
  function createTestEngine() {
    const moves: GameMoveDefinitions<EndTestState, EndTestMoves> = {
      damagePlayer: {
        reducer: (draft, context) => {
          if (context.params?.targetId && context.params?.amount) {
            const target = draft.players.find((p) => p.id === context.params?.targetId);
            if (target) {
              target.health -= context.params.amount as number;
              if (target.health <= 0) {
                // Set winner to the other player
                const winner = draft.players.find((p) => p.id !== context.params?.targetId);
                if (winner) {
                  draft.winner = winner.id;
                }
              }
            }
          }
        },
      },
      setWinner: {
        reducer: (draft, context) => {
          if (context.params?.winnerId) {
            draft.winner = context.params.winnerId as PlayerId;
          }
        },
      },
    };

    const gameDefinition: GameDefinition<EndTestState, EndTestMoves> = {
      endIf: (state) => {
        if (state.winner) {
          return {
            reason: "Player eliminated",
            winner: state.winner,
          };
        }
        return undefined;
      },
      moves,
      name: "End Test Game",
      setup: (players) => ({
        players: players.map((p) => ({
          health: 10,
          id: p.id as PlayerId,
          name: p.name || "Player",
        })),
        turnNumber: 1,
      }),
    };

    const players = [
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ];

    return new RuleEngine(gameDefinition, players);
  }

  describe("expectGameEnd", () => {
    it("should pass when game ends with expected winner", () => {
      const engine = createTestEngine();

      // Set winner
      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      // Should not throw
      expectGameEnd(engine, createPlayerId("p1"));
    });

    it("should throw when game has not ended", () => {
      const engine = createTestEngine();

      expect(() => {
        expectGameEnd(engine, createPlayerId("p1"));
      }).toThrow(/Expected game to have ended/);
    });

    it("should throw when winner does not match", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      expect(() => {
        expectGameEnd(engine, createPlayerId("p2"));
      }).toThrow(/Expected winner to be 'p2'/);
    });

    it("should work without specifying winner", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      // Should not throw - just checks that game ended
      expectGameEnd(engine);
    });

    it("should optionally check reason", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      // Should not throw
      expectGameEnd(engine, createPlayerId("p1"), "Player eliminated");
    });

    it("should throw when reason does not match", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      expect(() => {
        expectGameEnd(engine, createPlayerId("p1"), "Wrong reason");
      }).toThrow(/Expected reason to be 'Wrong reason'/);
    });

    it("should return game end result", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      const result = expectGameEnd(engine);
      expect(result.winner).toBe(createPlayerId("p1"));
      expect(result.reason).toBe("Player eliminated");
    });

    it("should work in realistic game scenario", () => {
      const engine = createTestEngine();

      // Damage player 2 until they lose
      engine.executeMove("damagePlayer", {
        params: { amount: 5, targetId: createPlayerId("p2") },
        playerId: createPlayerId("p1"),
      });

      expectGameNotEnded(engine); // Game should still be ongoing

      engine.executeMove("damagePlayer", {
        params: { amount: 5, targetId: createPlayerId("p2") },
        playerId: createPlayerId("p1"),
      });

      // Game should have ended
      expectGameEnd(engine, createPlayerId("p1"), "Player eliminated");
    });
  });

  describe("expectGameNotEnded", () => {
    it("should pass when game has not ended", () => {
      const engine = createTestEngine();

      // Should not throw
      expectGameNotEnded(engine);
    });

    it("should throw when game has ended", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      expect(() => {
        expectGameNotEnded(engine);
      }).toThrow(/Expected game to still be ongoing/);
    });

    it("should provide helpful error message with end details", () => {
      const engine = createTestEngine();

      engine.executeMove("setWinner", {
        params: { winnerId: createPlayerId("p1") },
        playerId: createPlayerId("p1"),
      });

      expect(() => {
        expectGameNotEnded(engine);
      }).toThrow(/"winner":"p1"/);
    });
  });

  describe("integration", () => {
    it("should work together to test game flow", () => {
      const engine = createTestEngine();

      // Initially game is not ended
      expectGameNotEnded(engine);

      // Do some damage but not enough to end game
      engine.executeMove("damagePlayer", {
        params: { amount: 3, targetId: createPlayerId("p2") },
        playerId: createPlayerId("p1"),
      });

      expectGameNotEnded(engine);

      // More damage
      engine.executeMove("damagePlayer", {
        params: { amount: 3, targetId: createPlayerId("p2") },
        playerId: createPlayerId("p1"),
      });

      expectGameNotEnded(engine);

      // Final damage should end game
      engine.executeMove("damagePlayer", {
        params: { amount: 4, targetId: createPlayerId("p2") },
        playerId: createPlayerId("p1"),
      });

      expectGameEnd(engine, createPlayerId("p1"));
    });
  });
});
