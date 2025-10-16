/**
 * Move Enumeration System Tests
 *
 * Tests the move enumeration functionality including:
 * - Basic enumeration
 * - Validation filtering
 * - Metadata inclusion
 * - Error handling
 * - Complex parameter types
 */

import { describe, expect, it } from "bun:test";
import { type GameDefinition, type Player, RuleEngine } from "../index";
import { createPlayerId } from "../types/branded-utils";

// Test game state
type TestGameState = {
  players: Array<{
    id: string;
    name: string;
    hand: string[];
    field: string[];
    mana: number;
  }>;
  currentPlayerIndex: number;
};

// Test move parameters
type PlayCardParams = {
  cardId: string;
};

type AttackParams = {
  attackerId: string;
  targetId: string;
};

type PassTurnParams = Record<string, never>;

type TestMoves = {
  playCard: PlayCardParams;
  attack: AttackParams;
  passTurn: PassTurnParams;
};

describe("Move Enumeration System", () => {
  describe("Basic Enumeration", () => {
    it("should enumerate moves with simple parameters", () => {
      const players: Player[] = [
        { id: "p1", name: "Player 1" },
        { id: "p2", name: "Player 2" },
      ];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name ?? "",
            hand: ["card1", "card2", "card3"],
            field: [],
            mana: 5,
          })),
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              if (!player) return [];

              // Return all cards in hand as possible parameters
              return player.hand.map((cardId: string) => ({ cardId }));
            },
            condition: (state, context) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              if (!player) return false;

              // Check if card is in hand
              return player.hand.includes(context.params.cardId);
            },
            reducer: (draft, context) => {
              const player = draft.players.find(
                (p) => p.id === context.playerId,
              );
              if (!player) return;

              // Move card from hand to field
              const index = player.hand.indexOf(context.params.cardId);
              if (index >= 0) {
                player.hand.splice(index, 1);
                player.field.push(context.params.cardId);
              }
            },
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      // Enumerate all moves
      const moves = engine.enumerateMoves(playerId);

      // Should have moves for: playCard (3 cards) + attack (0) + passTurn (1)
      const playCardMoves = moves.filter((m) => m.moveId === "playCard");
      const passMovess = moves.filter((m) => m.moveId === "passTurn");

      expect(playCardMoves.length).toBe(3);
      expect(passMovess.length).toBe(1);

      // Check that all cards are enumerated
      const cardIds = playCardMoves.map((m) => m.params.cardId);
      expect(cardIds).toContain("card1");
      expect(cardIds).toContain("card2");
      expect(cardIds).toContain("card3");

      // All should be valid
      for (const move of playCardMoves) {
        expect(move.isValid).toBe(true);
      }
    });

    it("should enumerate moves without parameters", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: [], field: [], mana: 0 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            // Enumerator returns single empty object for moves without params
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      const moves = engine.enumerateMoves(playerId, { validOnly: true });

      // Only passTurn should be valid
      expect(moves.length).toBe(1);
      expect(moves[0]?.moveId).toBe("passTurn");
      expect(moves[0]?.params).toEqual({});
      expect(moves[0]?.isValid).toBe(true);
    });
  });

  describe("Validation Filtering", () => {
    it("should filter by validOnly option", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: ["card1"], field: [], mana: 0 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              return player
                ? player.hand.map((cardId: string) => ({ cardId }))
                : [];
            },
            // Condition requires mana (which player doesn't have)
            condition: (state, context) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              return (player?.mana ?? 0) > 0;
            },
            reducer: () => {},
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      // Get all moves (including invalid)
      const allMoves = engine.enumerateMoves(playerId, { validOnly: false });
      expect(allMoves.length).toBeGreaterThan(1);

      // Check that playCard exists but is invalid
      const playCardMove = allMoves.find((m) => m.moveId === "playCard");
      expect(playCardMove).toBeDefined();
      expect(playCardMove?.isValid).toBe(false);
      expect(playCardMove?.validationError).toBeDefined();

      // Get only valid moves
      const validMoves = engine.enumerateMoves(playerId, { validOnly: true });

      // Only passTurn should be valid
      expect(validMoves.length).toBe(1);
      expect(validMoves[0]?.moveId).toBe("passTurn");
      expect(validMoves[0]?.isValid).toBe(true);
    });

    it("should include validation error details", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: ["card1"], field: [], mana: 0 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              return player
                ? player.hand.map((cardId: string) => ({ cardId }))
                : [];
            },
            // Return detailed failure information
            condition: (state, context) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              const required = 5;
              const available = player?.mana ?? 0;

              if (available < required) {
                return {
                  reason: `Not enough mana. Required: ${required}, Available: ${available}`,
                  errorCode: "INSUFFICIENT_MANA",
                  context: { required, available },
                };
              }

              return true;
            },
            reducer: () => {},
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      const moves = engine.enumerateMoves(playerId, { validOnly: false });
      const playCardMove = moves.find((m) => m.moveId === "playCard");

      expect(playCardMove).toBeDefined();
      expect(playCardMove?.isValid).toBe(false);
      expect(playCardMove?.validationError).toBeDefined();
      expect(playCardMove?.validationError?.errorCode).toBe(
        "INSUFFICIENT_MANA",
      );
      expect(playCardMove?.validationError?.reason).toContain(
        "Not enough mana",
      );
      expect(playCardMove?.validationError?.context).toEqual({
        required: 5,
        available: 0,
      });
    });
  });

  describe("Metadata Inclusion", () => {
    it("should include metadata when requested", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: ["card1"], field: [], mana: 5 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              return player
                ? player.hand.map((cardId: string) => ({ cardId }))
                : [];
            },
            condition: () => true,
            reducer: () => {},
            metadata: {
              displayName: "Play Card",
              description: "Play a card from your hand",
              category: "action",
              tags: ["card", "play"],
              priority: 1,
            },
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      // Without metadata
      const movesWithoutMeta = engine.enumerateMoves(playerId, {
        includeMetadata: false,
      });
      const playCardWithoutMeta = movesWithoutMeta.find(
        (m) => m.moveId === "playCard",
      );
      expect(playCardWithoutMeta?.metadata).toBeUndefined();

      // With metadata
      const movesWithMeta = engine.enumerateMoves(playerId, {
        includeMetadata: true,
      });
      const playCardWithMeta = movesWithMeta.find(
        (m) => m.moveId === "playCard",
      );

      expect(playCardWithMeta?.metadata).toBeDefined();
      expect(playCardWithMeta?.metadata?.displayName).toBe("Play Card");
      expect(playCardWithMeta?.metadata?.description).toBe(
        "Play a card from your hand",
      );
      expect(playCardWithMeta?.metadata?.category).toBe("action");
      expect(playCardWithMeta?.metadata?.tags).toEqual(["card", "play"]);
      expect(playCardWithMeta?.metadata?.priority).toBe(1);
    });
  });

  describe("Moves Without Enumerators", () => {
    it("should handle moves without enumerators", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: [], field: [], mana: 0 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            // No enumerator provided
            condition: () => true,
            reducer: () => {},
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      // With validOnly: false, should include move with error
      const allMoves = engine.enumerateMoves(playerId, { validOnly: false });
      const playCardMove = allMoves.find((m) => m.moveId === "playCard");

      expect(playCardMove).toBeDefined();
      expect(playCardMove?.isValid).toBe(false);
      expect(playCardMove?.validationError?.errorCode).toBe("NO_ENUMERATOR");
      expect(playCardMove?.validationError?.reason).toContain(
        "no enumerator provided",
      );

      // With validOnly: true, should not include move
      const validMoves = engine.enumerateMoves(playerId, { validOnly: true });
      const playCardInValid = validMoves.find((m) => m.moveId === "playCard");
      expect(playCardInValid).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle enumerator errors gracefully", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: [], field: [], mana: 0 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            // Enumerator that throws an error
            enumerator: () => {
              throw new Error("Test enumerator error");
            },
            condition: () => true,
            reducer: () => {},
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players, {
        logger: { level: "SILENT" }, // Suppress error logs in test
      });
      const playerId = createPlayerId("p1");

      // Should not throw, but include error result
      const moves = engine.enumerateMoves(playerId, { validOnly: false });
      const playCardMove = moves.find((m) => m.moveId === "playCard");

      expect(playCardMove).toBeDefined();
      expect(playCardMove?.isValid).toBe(false);
      expect(playCardMove?.validationError?.errorCode).toBe("ENUMERATOR_ERROR");
      expect(playCardMove?.validationError?.reason).toContain(
        "Test enumerator error",
      );
    });
  });

  describe("Filtering Options", () => {
    it("should filter by moveIds", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            { id: "p1", name: "Player 1", hand: ["card1"], field: [], mana: 5 },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              return player
                ? player.hand.map((cardId: string) => ({ cardId }))
                : [];
            },
            condition: () => true,
            reducer: () => {},
          },
          attack: {
            enumerator: () => [{ attackerId: "a1", targetId: "t1" }],
            condition: () => true,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      // Filter to only playCard and passTurn
      const filteredMoves = engine.enumerateMoves(playerId, {
        moveIds: ["playCard", "passTurn"],
      });

      const moveIds = filteredMoves.map((m) => m.moveId);
      expect(moveIds).toContain("playCard");
      expect(moveIds).toContain("passTurn");
      expect(moveIds).not.toContain("attack");
    });

    it("should limit results per move with maxPerMove", () => {
      const players: Player[] = [{ id: "p1", name: "Player 1" }];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [
            {
              id: "p1",
              name: "Player 1",
              hand: ["card1", "card2", "card3", "card4", "card5"],
              field: [],
              mana: 5,
            },
          ],
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              return player
                ? player.hand.map((cardId: string) => ({ cardId }))
                : [];
            },
            condition: () => true,
            reducer: () => {},
          },
          attack: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      // Limit to 2 results per move
      const limitedMoves = engine.enumerateMoves(playerId, {
        maxPerMove: 2,
      });

      const playCardMoves = limitedMoves.filter((m) => m.moveId === "playCard");
      expect(playCardMoves.length).toBe(2); // Limited to 2 instead of 5

      // Without limit
      const allMoves = engine.enumerateMoves(playerId);
      const allPlayCardMoves = allMoves.filter((m) => m.moveId === "playCard");
      expect(allPlayCardMoves.length).toBe(5); // All 5 cards
    });
  });

  describe("Complex Parameter Types", () => {
    it("should enumerate moves with multiple parameter fields", () => {
      const players: Player[] = [
        { id: "p1", name: "Player 1" },
        { id: "p2", name: "Player 2" },
      ];

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name ?? "",
            hand: [],
            field: p.id === "p1" ? ["attacker1", "attacker2"] : ["target1"],
            mana: 5,
          })),
          currentPlayerIndex: 0,
        }),
        moves: {
          playCard: {
            enumerator: () => [],
            condition: () => false,
            reducer: () => {},
          },
          attack: {
            // Enumerate all attacker-target combinations
            enumerator: (
              state: TestGameState,
              context: import("../moves/move-enumeration").MoveEnumerationContext,
            ) => {
              const results: AttackParams[] = [];
              const player = state.players.find(
                (p) => p.id === context.playerId,
              );
              if (!player) return [];

              // Get all opponent creatures
              const opponents = state.players.filter(
                (p) => p.id !== context.playerId,
              );

              for (const attackerId of player.field) {
                for (const opponent of opponents) {
                  for (const targetId of opponent.field) {
                    results.push({ attackerId, targetId });
                  }
                }
              }

              return results;
            },
            condition: () => true,
            reducer: () => {},
          },
          passTurn: {
            enumerator: () => [{}],
            condition: () => true,
            reducer: () => {},
          },
        },
      };

      const engine = new RuleEngine(gameDefinition, players);
      const playerId = createPlayerId("p1");

      const moves = engine.enumerateMoves(playerId, { validOnly: true });
      const attackMoves = moves.filter((m) => m.moveId === "attack");

      // Should have 2 attackers * 1 target = 2 attack combinations
      expect(attackMoves.length).toBe(2);

      // Check all combinations are present
      const combinations = attackMoves.map((m) => ({
        attacker: m.params.attackerId,
        target: m.params.targetId,
      }));

      expect(combinations).toContainEqual({
        attacker: "attacker1",
        target: "target1",
      });
      expect(combinations).toContainEqual({
        attacker: "attacker2",
        target: "target1",
      });
    });
  });
});
