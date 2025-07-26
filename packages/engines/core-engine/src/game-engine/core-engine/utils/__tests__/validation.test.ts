import { describe, expect, it } from "../../__tests__/test-utils";
import type { Zone } from "../../engine/zone-operation";
import {
  EntityNotFoundError,
  PermissionDeniedError,
  ValidationFailedError,
} from "../../errors/consolidated-errors";
import type { CoreCtx } from "../../state/context";
import {
  isCardInZone,
  isPlayerTurn,
  isValidCardInstanceId,
  isValidPlayerId,
  isValidZoneId,
  validateCardInstanceId,
  validateCardInZone,
  validateContextStructure,
  validatePlayerId,
  validatePlayerOrder,
  validatePlayerPriority,
  validatePlayerTurn,
  validateZoneId,
  validateZoneNotEmpty,
  validateZoneOwnership,
} from "../validation";

describe("Validation Utilities", () => {
  // Create a mock context for testing
  const mockCtx: CoreCtx = {
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
        card2: "def2",
      },
      player2: {
        card3: "def3",
      },
    },
    cardMetas: {}, // Add card metadata storage
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
        owner: "player1",
        cards: ["card2"],
        visibility: "private",
      },
      zone3: {
        id: "zone3",
        name: "Zone 3",
        owner: "player2",
        cards: ["card3"],
        visibility: "public",
      },
      emptyZone: {
        id: "emptyZone",
        name: "Empty Zone",
        owner: "player1",
        cards: [],
        visibility: "public",
      },
    },
  };

  describe("Player Validation", () => {
    it("should validate valid player IDs", () => {
      expect(isValidPlayerId(mockCtx, "player1")).toBe(true);
      expect(isValidPlayerId(mockCtx, "player2")).toBe(true);
      expect(() => validatePlayerId(mockCtx, "player1")).not.toThrow();
      expect(() => validatePlayerId(mockCtx, "player2")).not.toThrow();
    });

    it("should invalidate non-existent player IDs", () => {
      expect(isValidPlayerId(mockCtx, "player3")).toBe(false);
      expect(() => validatePlayerId(mockCtx, "player3")).toThrow(
        EntityNotFoundError,
      );
    });

    it("should validate player turn correctly", () => {
      expect(isPlayerTurn(mockCtx, "player1")).toBe(true);
      expect(isPlayerTurn(mockCtx, "player2")).toBe(false);
      expect(() => validatePlayerTurn(mockCtx, "player1")).not.toThrow();
      expect(() => validatePlayerTurn(mockCtx, "player2")).toThrow(
        PermissionDeniedError,
      );
    });

    it("should validate player priority correctly", () => {
      expect(() => validatePlayerPriority(mockCtx, "player1")).not.toThrow();
      expect(() => validatePlayerPriority(mockCtx, "player2")).toThrow(
        PermissionDeniedError,
      );
    });
  });

  describe("Zone Validation", () => {
    it("should validate valid zone IDs", () => {
      expect(isValidZoneId(mockCtx, "zone1")).toBe(true);
      expect(() => validateZoneId(mockCtx, "zone1")).not.toThrow();
    });

    it("should invalidate non-existent zone IDs", () => {
      expect(isValidZoneId(mockCtx, "zone4")).toBe(false);
      expect(() => validateZoneId(mockCtx, "zone4")).toThrow(
        EntityNotFoundError,
      );
    });

    it("should validate zone ownership", () => {
      const zone1 = mockCtx.cardZones!["zone1"] as Zone;
      const zone3 = mockCtx.cardZones!["zone3"] as Zone;

      expect(() => validateZoneOwnership(zone1, "player1")).not.toThrow();
      expect(() => validateZoneOwnership(zone3, "player1")).toThrow(
        PermissionDeniedError,
      );
    });

    it("should validate non-empty zones", () => {
      const zone1 = mockCtx.cardZones!["zone1"] as Zone;
      const emptyZone = mockCtx.cardZones!["emptyZone"] as Zone;

      expect(() => validateZoneNotEmpty(zone1)).not.toThrow();
      expect(() => validateZoneNotEmpty(emptyZone)).toThrow(
        ValidationFailedError,
      );
    });
  });

  describe("Card Validation", () => {
    it("should validate valid card instance IDs", () => {
      expect(isValidCardInstanceId(mockCtx, "player1", "card1")).toBe(true);
      expect(() =>
        validateCardInstanceId(mockCtx, "player1", "card1"),
      ).not.toThrow();
    });

    it("should invalidate non-existent card instance IDs", () => {
      expect(isValidCardInstanceId(mockCtx, "player1", "card3")).toBe(false);
      expect(() => validateCardInstanceId(mockCtx, "player1", "card3")).toThrow(
        EntityNotFoundError,
      );
    });

    it("should validate cards in zones", () => {
      expect(isCardInZone(mockCtx, "zone1", "card1")).toBe(true);
      expect(isCardInZone(mockCtx, "zone1", "card2")).toBe(false);
      expect(() => validateCardInZone(mockCtx, "zone1", "card1")).not.toThrow();
      expect(() => validateCardInZone(mockCtx, "zone1", "card2")).toThrow(
        ValidationFailedError,
      );
    });
  });

  describe("Context Structure Validation", () => {
    it("should validate a valid context structure", () => {
      expect(() => validateContextStructure(mockCtx)).not.toThrow();
    });

    it("should validate player order", () => {
      expect(() => validatePlayerOrder(mockCtx)).not.toThrow();

      const invalidCtx = {
        ...mockCtx,
        playerOrder: [],
      };

      expect(() => validatePlayerOrder(invalidCtx)).toThrow(
        ValidationFailedError,
      );
    });

    it("should detect invalid player references", () => {
      const invalidCtx = {
        ...mockCtx,
        playerOrder: ["player1", "player3"],
      };

      expect(() => validatePlayerOrder(invalidCtx)).toThrow(
        EntityNotFoundError,
      );
    });
  });
});
