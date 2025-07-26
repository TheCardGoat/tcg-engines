import { describe, expect, it } from "../../__tests__/test-utils";
import {
  EntityNotFoundError,
  ValidationFailedError,
} from "../../errors/consolidated-errors";
import type { CoreCtx } from "../../state/context";
import {
  createContext,
  createContextWithGameOver,
  createContextWithMoveHistory,
  createContextWithNextTurnPlayer,
  createContextWithPhase,
  createContextWithPriorityPlayer,
  createContextWithTurnPlayer,
  createTestContext,
} from "../context-factory";

describe("Context Factory Utilities", () => {
  // Create a basic valid context for testing
  const createValidTestContext = (): CoreCtx => {
    return {
      gameId: "test-game",
      matchId: "test-match",
      playerOrder: ["player1", "player2"],
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      numTurns: 1,
      numMoves: 0,
      numTurnMoves: 0,
      moveHistory: [],
      players: {
        player1: {
          id: "player1",
          name: "Player 1",
        },
        player2: {
          id: "player2",
          name: "Player 2",
        },
      },
      cards: {
        player1: {
          card1: "def1",
        },
        player2: {
          card2: "def2",
        },
      },
      cardZones: {
        zone1: {
          id: "zone1",
          name: "Zone 1",
          owner: "player1",
          cards: ["card1"],
          visibility: "public",
        },
        zone2: {
          id: "zone2",
          name: "Zone 2",
          owner: "player2",
          cards: ["card2"],
          visibility: "public",
        },
      },
    };
  };

  describe("createContext", () => {
    it("should create a valid context with minimal options", () => {
      const ctx = createContext({
        cards: {
          player1: {},
          player2: {},
        },
        players: {
          player1: { id: "player1", name: "Player 1" },
          player2: { id: "player2", name: "Player 2" },
        },
      });

      expect(ctx).toBeDefined();
      expect(ctx.gameId).toBe("default-game-id");
      expect(ctx.matchId).toBe("default-match-id");
      expect(ctx.playerOrder).toEqual(["player1", "player2"]); // Now derived from players
      expect(ctx.numTurns).toBe(1);
    });

    it("should create a context with all provided options", () => {
      const ctx = createContext({
        playerOrder: ["player1", "player2"],
        initialSegment: "startingAGame",
        initialPhase: "setup",
        initialStep: "initial",
        gameId: "custom-game",
        matchId: "custom-match",
        seed: 12345,
        cards: {
          player1: {
            card1: "def1",
          },
          player2: {
            card2: "def2",
          },
        },
        players: {
          player1: { id: "player1", name: "Player 1" },
          player2: { id: "player2", name: "Player 2" },
        },
        cardZones: {
          zone1: {
            id: "zone1",
            name: "Zone 1",
            owner: "player1",
            cards: ["card1"],
            visibility: "public",
          },
          zone2: {
            id: "zone2",
            name: "Zone 2",
            owner: "player2",
            cards: ["card2"],
            visibility: "public",
          },
        },
      });

      expect(ctx).toBeDefined();
      expect(ctx.gameId).toBe("custom-game");
      expect(ctx.matchId).toBe("custom-match");
      expect(ctx.playerOrder).toEqual(["player1", "player2"]);
      expect(ctx.currentSegment).toBe("startingAGame");
      expect(ctx.currentPhase).toBe("setup");
      expect(ctx.currentStep).toBe("initial");
      expect(ctx.seed).toBe(12345);
      expect(ctx.cards.player1.card1).toBeDefined();
      expect(ctx.cardZones?.zone1).toBeDefined();
    });

    it("should throw an error for invalid context structure", () => {
      expect(() => {
        createContext({
          cards: {
            player1: {},
          },
          players: {
            // Missing player1 but has cards for player1
            player2: { id: "player2", name: "Player 2" },
          },
        });
      }).toThrow(ValidationFailedError);
    });
  });

  describe("createContextWithNextTurnPlayer", () => {
    it("should advance to the next turn player", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithNextTurnPlayer(ctx);

      expect(newCtx).not.toBe(ctx); // Should be a new object
      expect(newCtx.turnPlayerPos).toBe(1);
      expect(ctx.turnPlayerPos).toBe(0); // Original unchanged
    });

    it("should wrap around to the first player", () => {
      const ctx = createValidTestContext();
      ctx.turnPlayerPos = 1;
      const newCtx = createContextWithNextTurnPlayer(ctx);

      expect(newCtx.turnPlayerPos).toBe(0);
    });

    it("should create a deep copy of arrays and objects", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithNextTurnPlayer(ctx);

      expect(newCtx.playerOrder).not.toBe(ctx.playerOrder);
      expect(newCtx.cards).not.toBe(ctx.cards);
      expect(newCtx.cardZones).not.toBe(ctx.cardZones);
    });
  });

  describe("createContextWithPriorityPlayer", () => {
    it("should set the priority player", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithPriorityPlayer(ctx, "player2");

      expect(newCtx).not.toBe(ctx); // Should be a new object
      expect(newCtx.priorityPlayerPos).toBe(1);
      expect(ctx.priorityPlayerPos).toBe(0); // Original unchanged
    });

    it("should throw an error for invalid player ID", () => {
      const ctx = createValidTestContext();
      expect(() => {
        createContextWithPriorityPlayer(ctx, "player3");
      }).toThrow(EntityNotFoundError);
    });

    it("should create a deep copy of arrays and objects", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithPriorityPlayer(ctx, "player2");

      expect(newCtx.playerOrder).not.toBe(ctx.playerOrder);
      expect(newCtx.cards).not.toBe(ctx.cards);
      expect(newCtx.cardZones).not.toBe(ctx.cardZones);
    });
  });

  describe("createContextWithTurnPlayer", () => {
    it("should set the turn player", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithTurnPlayer(ctx, "player2");

      expect(newCtx).not.toBe(ctx); // Should be a new object
      expect(newCtx.turnPlayerPos).toBe(1);
      expect(ctx.turnPlayerPos).toBe(0); // Original unchanged
    });

    it("should throw an error for invalid player ID", () => {
      const ctx = createValidTestContext();
      expect(() => {
        createContextWithTurnPlayer(ctx, "player3");
      }).toThrow(EntityNotFoundError);
    });

    it("should create a deep copy of arrays and objects", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithTurnPlayer(ctx, "player2");

      expect(newCtx.playerOrder).not.toBe(ctx.playerOrder);
      expect(newCtx.cards).not.toBe(ctx.cards);
      expect(newCtx.cardZones).not.toBe(ctx.cardZones);
    });
  });

  describe("createContextWithPhase", () => {
    it("should update all phase information", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithPhase(
        ctx,
        "newSegment",
        "newPhase",
        "newStep",
      );

      expect(newCtx).not.toBe(ctx); // Should be a new object
      expect(newCtx.currentSegment).toBe("newSegment");
      expect(newCtx.currentPhase).toBe("newPhase");
      expect(newCtx.currentStep).toBe("newStep");
    });

    it("should only update provided phase information", () => {
      const ctx = createValidTestContext();
      ctx.currentSegment = "oldSegment";
      ctx.currentPhase = "oldPhase";
      ctx.currentStep = "oldStep";

      const newCtx = createContextWithPhase(ctx, undefined, "newPhase");

      expect(newCtx.currentSegment).toBe("oldSegment");
      expect(newCtx.currentPhase).toBe("newPhase");
      expect(newCtx.currentStep).toBe("oldStep");
    });

    it("should create a deep copy of arrays and objects", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithPhase(ctx, "newSegment");

      expect(newCtx.playerOrder).not.toBe(ctx.playerOrder);
      expect(newCtx.cards).not.toBe(ctx.cards);
      expect(newCtx.cardZones).not.toBe(ctx.cardZones);
    });
  });

  describe("createContextWithMoveHistory", () => {
    it("should add a move to history", () => {
      const ctx = createValidTestContext();
      const moveData = { cardId: "card1", target: "zone2" };
      const newCtx = createContextWithMoveHistory(
        ctx,
        "player1",
        "PLAY_CARD",
        moveData,
      );

      expect(newCtx).not.toBe(ctx); // Should be a new object
      expect(newCtx.moveHistory.length).toBe(1);
      expect(newCtx.moveHistory[0].playerId).toBe("player1");
      expect(newCtx.moveHistory[0].type).toBe("PLAY_CARD");
      expect(newCtx.moveHistory[0].data).toBe(moveData);
      expect(newCtx.numMoves).toBe(1);
      expect(newCtx.numTurnMoves).toBe(1);
    });

    it("should throw an error for invalid player ID", () => {
      const ctx = createValidTestContext();
      expect(() => {
        createContextWithMoveHistory(ctx, "player3", "PLAY_CARD", {});
      }).toThrow(EntityNotFoundError);
    });

    it("should create a deep copy of arrays and objects", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithMoveHistory(
        ctx,
        "player1",
        "PLAY_CARD",
        {},
      );

      expect(newCtx.playerOrder).not.toBe(ctx.playerOrder);
      expect(newCtx.cards).not.toBe(ctx.cards);
      expect(newCtx.cardZones).not.toBe(ctx.cardZones);
      expect(newCtx.moveHistory).not.toBe(ctx.moveHistory);
    });
  });

  describe("createContextWithGameOver", () => {
    it("should set game over state with winner", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithGameOver(ctx, "player1");

      expect(newCtx).not.toBe(ctx); // Should be a new object
      expect(newCtx.gameOver).toBe(true);
      expect(newCtx.winner).toBe("player1");
    });

    it("should set game over state with custom data", () => {
      const ctx = createValidTestContext();
      const gameOverData = {
        reason: "timeout",
        details: "Player disconnected",
      };
      const newCtx = createContextWithGameOver(ctx, undefined, gameOverData);

      expect(newCtx.gameOver).toBe(gameOverData);
      expect(newCtx.winner).toBeUndefined();
    });

    it("should throw an error for invalid winner ID", () => {
      const ctx = createValidTestContext();
      expect(() => {
        createContextWithGameOver(ctx, "player3");
      }).toThrow(EntityNotFoundError);
    });

    it("should create a deep copy of arrays and objects", () => {
      const ctx = createValidTestContext();
      const newCtx = createContextWithGameOver(ctx, "player1");

      expect(newCtx.playerOrder).not.toBe(ctx.playerOrder);
      expect(newCtx.cards).not.toBe(ctx.cards);
      expect(newCtx.cardZones).not.toBe(ctx.cardZones);
    });
  });

  describe("createTestContext", () => {
    it("should create a minimal test context", () => {
      const ctx = createTestContext();

      expect(ctx).toBeDefined();
      expect(ctx.gameId).toBe("test-game");
      expect(ctx.matchId).toBe("test-match");
      expect(ctx.playerOrder).toEqual(["player1", "player2"]);
      expect(ctx.players.player1).toBeDefined();
      expect(ctx.players.player2).toBeDefined();
      expect(ctx.cards).toBeDefined();
      expect(ctx.cardZones).toBeDefined();
    });

    it("should allow overriding default values", () => {
      const ctx = createTestContext({
        gameId: "custom-game",
        matchId: "custom-match",
        numTurns: 5,
      });

      expect(ctx.gameId).toBe("custom-game");
      expect(ctx.matchId).toBe("custom-match");
      expect(ctx.numTurns).toBe(5);
      // Default values should still be present
      expect(ctx.playerOrder).toEqual(["player1", "player2"]);
    });
  });
});
