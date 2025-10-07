import { describe, expect, it } from "bun:test";
import type { DefinitionRegistry } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import type { Modifier } from "../cards/modifiers";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { MoveDefinition, MoveInstance } from "./move-definition";
import { canPerformMove, getLegalMoves, validateMove } from "./move-validation";

type TestGameState = {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
};

describe("Move Validation", () => {
  const player1 = createPlayerId("p1");
  const player2 = createPlayerId("p2");
  const card1 = createCardId("card1");
  const card2 = createCardId("card2");
  const playZone = createZoneId("play");

  const registry: DefinitionRegistry = new Map([
    ["creature1", { id: "creature1", name: "Creature", type: "creature" }],
  ]);

  const state: TestGameState = {
    cards: {
      [card1]: {
        id: card1,
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      },
      [card2]: {
        id: card2,
        definitionId: "creature1",
        owner: player2,
        controller: player2,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      },
    },
  };

  describe("validateMove", () => {
    it("should validate move without targets", () => {
      const moveDef: MoveDefinition = {
        id: "draw",
        name: "Draw",
        type: "draw-card",
      };

      const moveInstance: MoveInstance = {
        moveId: "draw",
        playerId: player1,
      };

      const result = validateMove(moveInstance, moveDef, state, registry);
      expect(result.valid).toBe(true);
    });

    it("should fail when targets required but not provided", () => {
      const moveDef: MoveDefinition = {
        id: "bolt",
        name: "Bolt",
        type: "play-card",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      const moveInstance: MoveInstance = {
        moveId: "bolt",
        playerId: player1,
      };

      const result = validateMove(moveInstance, moveDef, state, registry);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("requires targets");
    });

    it("should validate move with valid targets", () => {
      const moveDef: MoveDefinition = {
        id: "bolt",
        name: "Bolt",
        type: "play-card",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      const moveInstance: MoveInstance = {
        moveId: "bolt",
        playerId: player1,
        sourceCardId: card1,
        targets: [[card2]],
      };

      const result = validateMove(moveInstance, moveDef, state, registry);
      expect(result.valid).toBe(true);
    });

    it("should fail when target card does not exist", () => {
      const moveDef: MoveDefinition = {
        id: "bolt",
        name: "Bolt",
        type: "play-card",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      const nonexistentCard = createCardId("nonexistent");
      const moveInstance: MoveInstance = {
        moveId: "bolt",
        playerId: player1,
        targets: [[nonexistentCard]],
      };

      const result = validateMove(moveInstance, moveDef, state, registry);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("do not exist");
    });

    it("should validate precondition isLegal", () => {
      const moveDef: MoveDefinition = {
        id: "special",
        name: "Special",
        type: "custom",
        preconditions: {
          isLegal: (playerId) => playerId === player1,
        },
      };

      const moveInstance: MoveInstance = {
        moveId: "special",
        playerId: player1,
      };

      const result = validateMove(moveInstance, moveDef, state, registry);
      expect(result.valid).toBe(true);
    });

    it("should fail precondition check", () => {
      const moveDef: MoveDefinition = {
        id: "special",
        name: "Special",
        type: "custom",
        preconditions: {
          isLegal: (playerId) => playerId === player2,
        },
      };

      const moveInstance: MoveInstance = {
        moveId: "special",
        playerId: player1,
      };

      const result = validateMove(moveInstance, moveDef, state, registry);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("precondition");
    });
  });

  describe("canPerformMove", () => {
    it("should return true for move without preconditions", () => {
      const moveDef: MoveDefinition = {
        id: "draw",
        name: "Draw",
        type: "draw-card",
      };

      const result = canPerformMove(moveDef, player1, state);
      expect(result).toBe(true);
    });

    it("should check isLegal precondition", () => {
      const moveDef: MoveDefinition = {
        id: "special",
        name: "Special",
        type: "custom",
        preconditions: {
          isLegal: (playerId) => playerId === player1,
        },
      };

      expect(canPerformMove(moveDef, player1, state)).toBe(true);
      expect(canPerformMove(moveDef, player2, state)).toBe(false);
    });

    it("should check custom cost predicate", () => {
      const moveDef: MoveDefinition = {
        id: "expensive",
        name: "Expensive",
        type: "custom",
        cost: {
          custom: (playerId) => playerId === player1,
        },
      };

      expect(canPerformMove(moveDef, player1, state)).toBe(true);
      expect(canPerformMove(moveDef, player2, state)).toBe(false);
    });
  });

  describe("getLegalMoves", () => {
    it("should return all legal moves", () => {
      const moves: MoveDefinition[] = [
        { id: "draw", name: "Draw", type: "draw-card" },
        { id: "pass", name: "Pass", type: "pass-priority" },
      ];

      const legalMoves = getLegalMoves(moves, player1, state);
      expect(legalMoves).toHaveLength(2);
    });

    it("should filter out illegal moves", () => {
      const moves: MoveDefinition[] = [
        { id: "draw", name: "Draw", type: "draw-card" },
        {
          id: "special",
          name: "Special",
          type: "custom",
          preconditions: {
            isLegal: (playerId) => playerId === player2,
          },
        },
      ];

      const legalMoves = getLegalMoves(moves, player1, state);
      expect(legalMoves).toHaveLength(1);
      expect(legalMoves[0].id).toBe("draw");
    });

    it("should return empty array when no moves are legal", () => {
      const moves: MoveDefinition[] = [
        {
          id: "impossible",
          name: "Impossible",
          type: "custom",
          preconditions: {
            isLegal: () => false,
          },
        },
      ];

      const legalMoves = getLegalMoves(moves, player1, state);
      expect(legalMoves).toHaveLength(0);
    });
  });
});
