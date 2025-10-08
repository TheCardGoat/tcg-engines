import { describe, expect, it } from "bun:test";
import type { FlowDefinition } from "../../flow/xstate-compat";
import type { GameDefinition, GameEndResult, Player } from "../game-definition";
import type { MoveDefinitions } from "../move-definition";

// Test state type for a simple coin flip game
type CoinFlipState = {
  players: Array<{ id: string; name: string; coins: number }>;
  currentPlayerIndex: number;
  round: number;
  winner?: string;
};

// Test move types for the coin flip game
type CoinFlipMoves = {
  flip: { prediction: "heads" | "tails" };
  pass: Record<string, never>;
};

describe("GameDefinition type system", () => {
  describe("GameDefinition type with generics", () => {
    it("should allow creating a valid GameDefinition with generic state and moves", () => {
      const setupFn = (players: Player[]): CoinFlipState => ({
        players: players.map((p) => ({ id: p.id, name: p.name, coins: 3 })),
        currentPlayerIndex: 0,
        round: 1,
      });

      const moves: MoveDefinitions<CoinFlipState, CoinFlipMoves> = {
        flip: {
          reducer: (state, _context) => {
            // Flip implementation will be added later
            return state;
          },
        },
        pass: {
          reducer: (state, _context) => {
            return state;
          },
        },
      };

      const flow: FlowDefinition<CoinFlipState> = {
        id: "coinFlipFlow",
        initial: "main",
        states: {
          main: {
            type: "normal",
          },
        },
      };

      const gameDefinition: GameDefinition<CoinFlipState, CoinFlipMoves> = {
        name: "Coin Flip",
        minPlayers: 2,
        maxPlayers: 2,
        setup: setupFn,
        moves,
        flow,
      };

      expect(gameDefinition.name).toBe("Coin Flip");
      expect(gameDefinition.minPlayers).toBe(2);
      expect(gameDefinition.maxPlayers).toBe(2);
      expect(typeof gameDefinition.setup).toBe("function");
      expect(gameDefinition.moves).toBe(moves);
      expect(gameDefinition.flow).toBe(flow);
    });

    it("should support optional endIf game end condition", () => {
      const endIfFn = (state: CoinFlipState): GameEndResult | undefined => {
        const winner = state.players.find((p) => p.coins >= 5);
        if (winner) {
          return {
            winner: winner.id,
            reason: "Reached 5 coins",
          };
        }
        return undefined;
      };

      const gameDefinition: GameDefinition<CoinFlipState, CoinFlipMoves> = {
        name: "Coin Flip",
        minPlayers: 2,
        maxPlayers: 2,
        setup: (players) => ({
          players: players.map((p) => ({ id: p.id, name: p.name, coins: 3 })),
          currentPlayerIndex: 0,
          round: 1,
        }),
        moves: {
          flip: {
            reducer: (state) => state,
          },
          pass: {
            reducer: (state) => state,
          },
        },
        flow: {
          id: "coinFlipFlow",
          initial: "main",
          states: {
            main: {
              type: "normal",
            },
          },
        },
        endIf: endIfFn,
      };

      expect(gameDefinition.endIf).toBe(endIfFn);
    });

    it("should support optional playerView filtering function", () => {
      const playerViewFn = (
        state: CoinFlipState,
        _playerId: string,
      ): CoinFlipState => {
        // Filter out opponent's coin count in actual implementation
        return state;
      };

      const gameDefinition: GameDefinition<CoinFlipState, CoinFlipMoves> = {
        name: "Coin Flip",
        minPlayers: 2,
        maxPlayers: 2,
        setup: (players) => ({
          players: players.map((p) => ({ id: p.id, name: p.name, coins: 3 })),
          currentPlayerIndex: 0,
          round: 1,
        }),
        moves: {
          flip: {
            reducer: (state) => state,
          },
          pass: {
            reducer: (state) => state,
          },
        },
        flow: {
          id: "coinFlipFlow",
          initial: "main",
          states: {
            main: {
              type: "normal",
            },
          },
        },
        playerView: playerViewFn,
      };

      expect(gameDefinition.playerView).toBe(playerViewFn);
    });

    it("should enforce required fields in GameDefinition", () => {
      // This test is type-level - it ensures the compiler catches missing fields
      // If this compiles without errors, the required fields are enforced

      // @ts-expect-error - missing required fields
      const invalidDefinition: GameDefinition<CoinFlipState, CoinFlipMoves> = {
        name: "Incomplete",
      };

      // Suppress unused variable warning
      expect(invalidDefinition).toBeDefined();
    });

    it("should allow GameDefinition to be generic over any state type", () => {
      type CustomState = {
        customField: string;
        count: number;
      };

      type CustomMoves = {
        customMove: { value: number };
      };

      const customGame: GameDefinition<CustomState, CustomMoves> = {
        name: "Custom Game",
        minPlayers: 1,
        maxPlayers: 4,
        setup: () => ({
          customField: "test",
          count: 0,
        }),
        moves: {
          customMove: {
            reducer: (state) => state,
          },
        },
        flow: {
          id: "customFlow",
          initial: "main",
          states: {
            main: {
              type: "normal",
            },
          },
        },
      };

      expect(customGame.name).toBe("Custom Game");
    });
  });

  describe("Player type", () => {
    it("should have required id and name fields", () => {
      const player: Player = {
        id: "player-1",
        name: "Alice",
      };

      expect(player.id).toBe("player-1");
      expect(player.name).toBe("Alice");
    });
  });

  describe("GameEndResult type", () => {
    it("should support winner and reason fields", () => {
      const result: GameEndResult = {
        winner: "player-1",
        reason: "Victory condition met",
      };

      expect(result.winner).toBe("player-1");
      expect(result.reason).toBe("Victory condition met");
    });

    it("should support draw games without winner", () => {
      const result: GameEndResult = {
        winner: undefined,
        reason: "Stalemate",
      };

      expect(result.winner).toBeUndefined();
      expect(result.reason).toBe("Stalemate");
    });
  });
});
