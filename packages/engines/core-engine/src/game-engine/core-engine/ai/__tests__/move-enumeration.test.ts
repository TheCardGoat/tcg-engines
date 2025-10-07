import { describe, expect, it } from "bun:test";
import type { CardInstance } from "../../card-instance/card-instance-types";
import {
  createCardId,
  createPlayerId,
  createZoneId,
} from "../../types/branded-types";
import {
  countValidMoves,
  type EnumeratedMove,
  enumerateValidMoves,
  enumerateValidTargets,
  type GameStateForEnumeration,
  isValidMove,
  type MoveEnumerationContext,
} from "../move-enumeration";

describe("AI Move Enumeration", () => {
  const player1 = createPlayerId("player-1");
  const player2 = createPlayerId("player-2");
  const handZone = createZoneId("hand");
  const playZone = createZoneId("play");

  describe("EnumeratedMove Type", () => {
    it("should have all required fields", () => {
      const move: EnumeratedMove = {
        moveName: "playCard",
        playerId: player1,
        targets: [createCardId("card-1")],
        priority: 1,
        score: 0.5,
      };

      expect(move.moveName).toBe("playCard");
      expect(move.playerId).toBe(player1);
      expect(move.targets).toEqual([createCardId("card-1")]);
      expect(move.priority).toBe(1);
      expect(move.score).toBe(0.5);
    });

    it("should support optional score field", () => {
      const move: EnumeratedMove = {
        moveName: "passTurn",
        playerId: player1,
        targets: [],
        priority: 0,
      };

      expect(move.score).toBeUndefined();
    });
  });

  describe("enumerateValidMoves", () => {
    it("should enumerate all valid moves for a player", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard", "passTurn"],
        canExecuteMove: (moveName: string) => true,
        getTargetsForMove: (moveName: string) => {
          if (moveName === "playCard") {
            return state.cards
              .filter((c) => c.zone === handZone)
              .map((c) => c.id);
          }
          return [];
        },
      };

      const moves = enumerateValidMoves(state, player1, context);

      expect(moves.length).toBeGreaterThan(0);
      expect(moves.some((m) => m.moveName === "playCard")).toBe(true);
      expect(moves.some((m) => m.moveName === "passTurn")).toBe(true);
    });

    it("should filter out moves player cannot execute", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard", "passTurn"],
        canExecuteMove: (moveName: string) => moveName === "passTurn",
        getTargetsForMove: () => [],
      };

      const moves = enumerateValidMoves(state, player1, context);

      expect(moves.every((m) => m.moveName === "passTurn")).toBe(true);
    });

    it("should include all target combinations for moves", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard"],
        canExecuteMove: () => true,
        getTargetsForMove: (moveName: string) => {
          if (moveName === "playCard") {
            return state.cards.map((c) => c.id);
          }
          return [];
        },
      };

      const moves = enumerateValidMoves(state, player1, context);

      // Should have one move per card (2 cards)
      const playCardMoves = moves.filter((m) => m.moveName === "playCard");
      expect(playCardMoves.length).toBe(2);
    });

    it("should assign default priority based on move order", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["highPriority", "mediumPriority", "lowPriority"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [],
      };

      const moves = enumerateValidMoves(state, player1, context);

      // Priority should be based on order in availableMoves
      const highPri = moves.find((m) => m.moveName === "highPriority");
      const medPri = moves.find((m) => m.moveName === "mediumPriority");
      const lowPri = moves.find((m) => m.moveName === "lowPriority");

      expect(highPri?.priority).toBeGreaterThan(medPri?.priority || 0);
      expect(medPri?.priority).toBeGreaterThan(lowPri?.priority || 0);
    });
  });

  describe("enumerateValidTargets", () => {
    it("should enumerate valid targets for a specific move", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player2,
            controller: player2,
            zone: playZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["targetCard"],
        canExecuteMove: () => true,
        getTargetsForMove: () => state.cards.map((c) => c.id),
      };

      const targets = enumerateValidTargets(state, "targetCard", context);

      expect(targets.length).toBe(2);
      expect(targets).toContain(createCardId("card-1"));
      expect(targets).toContain(createCardId("card-2"));
    });

    it("should return empty array for moves with no targets", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["passTurn"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [],
      };

      const targets = enumerateValidTargets(state, "passTurn", context);

      expect(targets).toEqual([]);
    });

    it("should filter targets based on game rules", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: playZone,
            tapped: true, // Tapped
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["tapCard"],
        canExecuteMove: () => true,
        getTargetsForMove: (moveName: string) => {
          // Only untapped cards can be tapped
          return state.cards.filter((c) => !c.tapped).map((c) => c.id);
        },
      };

      const targets = enumerateValidTargets(state, "tapCard", context);

      expect(targets.length).toBe(1);
      expect(targets[0]).toBe(createCardId("card-1"));
    });
  });

  describe("isValidMove", () => {
    it("should return true for valid move", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [createCardId("card-1")],
      };

      const move: EnumeratedMove = {
        moveName: "playCard",
        playerId: player1,
        targets: [createCardId("card-1")],
        priority: 1,
      };

      const result = isValidMove(state, move, context);

      expect(result).toBe(true);
    });

    it("should return false for move not in available moves", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["passTurn"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [],
      };

      const move: EnumeratedMove = {
        moveName: "invalidMove",
        playerId: player1,
        targets: [],
        priority: 0,
      };

      const result = isValidMove(state, move, context);

      expect(result).toBe(false);
    });

    it("should return false for move player cannot execute", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["specialMove"],
        canExecuteMove: () => false,
        getTargetsForMove: () => [],
      };

      const move: EnumeratedMove = {
        moveName: "specialMove",
        playerId: player1,
        targets: [],
        priority: 1,
      };

      const result = isValidMove(state, move, context);

      expect(result).toBe(false);
    });

    it("should return false for invalid targets", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [createCardId("card-1")],
      };

      const move: EnumeratedMove = {
        moveName: "playCard",
        playerId: player1,
        targets: [createCardId("invalid-card")], // Invalid target
        priority: 1,
      };

      const result = isValidMove(state, move, context);

      expect(result).toBe(false);
    });
  });

  describe("countValidMoves", () => {
    it("should count valid moves without full enumeration", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
          {
            id: createCardId("card-2"),
            definitionId: "mountain",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard", "passTurn"],
        canExecuteMove: () => true,
        getTargetsForMove: (moveName: string) => {
          if (moveName === "playCard") {
            return state.cards.map((c) => c.id);
          }
          return [];
        },
      };

      const count = countValidMoves(state, player1, context);

      // Should count: 2 playCard moves (one per card) + 1 passTurn = 3
      expect(count).toBe(3);
    });

    it("should return 0 when no valid moves", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: [],
        canExecuteMove: () => false,
        getTargetsForMove: () => [],
      };

      const count = countValidMoves(state, player1, context);

      expect(count).toBe(0);
    });

    it("should be more efficient than full enumeration", () => {
      const state: GameStateForEnumeration = {
        cards: Array.from({ length: 100 }, (_, i) => ({
          id: createCardId(`card-${i}`),
          definitionId: "test",
          owner: player1,
          controller: player1,
          zone: handZone,
          tapped: false,
          flipped: true,
          revealed: false,
          phased: false,
        })),
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard"],
        canExecuteMove: () => true,
        getTargetsForMove: (moveName: string) => {
          if (moveName === "playCard") {
            return state.cards.map((c) => c.id);
          }
          return [];
        },
      };

      // Count should be much faster than enumeration
      const startCount = performance.now();
      const count = countValidMoves(state, player1, context);
      const countTime = performance.now() - startCount;

      const startEnum = performance.now();
      const moves = enumerateValidMoves(state, player1, context);
      const enumTime = performance.now() - startEnum;

      expect(count).toBe(moves.length);
      // Count should be faster (though this is a soft check)
      expect(countTime).toBeLessThan(enumTime * 2);
    });
  });

  describe("Move Priority and Scoring", () => {
    it("should support custom priority assignment", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["attack", "defend", "pass"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [],
        getMovePriority: (moveName: string) => {
          if (moveName === "attack") return 10;
          if (moveName === "defend") return 5;
          return 1;
        },
      };

      const moves = enumerateValidMoves(state, player1, context);

      const attack = moves.find((m) => m.moveName === "attack");
      const defend = moves.find((m) => m.moveName === "defend");
      const pass = moves.find((m) => m.moveName === "pass");

      expect(attack?.priority).toBe(10);
      expect(defend?.priority).toBe(5);
      expect(pass?.priority).toBe(1);
    });

    it("should support custom scoring function", () => {
      const state: GameStateForEnumeration = {
        cards: [
          {
            id: createCardId("card-1"),
            definitionId: "forest",
            owner: player1,
            controller: player1,
            zone: handZone,
            tapped: false,
            flipped: true,
            revealed: false,
            phased: false,
          },
        ],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["playCard"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [createCardId("card-1")],
        scoreMove: (move: EnumeratedMove, state: GameStateForEnumeration) => {
          // Higher score for playing cards
          return move.moveName === "playCard" ? 0.8 : 0.1;
        },
      };

      const moves = enumerateValidMoves(state, player1, context);

      const playCard = moves.find((m) => m.moveName === "playCard");
      expect(playCard?.score).toBe(0.8);
    });

    it("should sort moves by priority and score", () => {
      const state: GameStateForEnumeration = {
        cards: [],
        currentPlayer: player1,
      };

      const context: MoveEnumerationContext = {
        availableMoves: ["lowPriority", "highPriority", "mediumPriority"],
        canExecuteMove: () => true,
        getTargetsForMove: () => [],
        getMovePriority: (moveName: string) => {
          if (moveName === "highPriority") return 10;
          if (moveName === "mediumPriority") return 5;
          return 1;
        },
      };

      const moves = enumerateValidMoves(state, player1, context);

      // Moves should be sorted by priority (descending)
      for (let i = 0; i < moves.length - 1; i++) {
        expect(moves[i].priority).toBeGreaterThanOrEqual(moves[i + 1].priority);
      }
    });
  });
});
