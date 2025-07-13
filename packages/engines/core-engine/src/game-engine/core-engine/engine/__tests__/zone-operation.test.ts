import { beforeEach, describe, expect, it } from "bun:test";
import { LogCollector } from "../../../utils/log-collector";
import type { CoreCtx } from "../../state/context";
import {
  isZoneOperationError,
  moveCardByInstanceId,
  type Zone,
  type ZoneOperationError,
} from "../zone-operation";

describe("zone-operation", () => {
  let mockCtx: CoreCtx;
  let logCollector: LogCollector;

  beforeEach(() => {
    logCollector = new LogCollector();
    mockCtx = {
      playerOrder: ["player1", "player2"],
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      currentPhase: "mainPhase",
      otp: "player1",
      seed: "12345",
      _random: { seed: "12345" },
      numTurns: 1,
      numMoves: 0,
      seenCards: new Map(),
      cardZones: {
        "player1-hand": {
          id: "player1-hand",
          name: "hand",
          owner: "player1",
          cards: ["card1", "card2"],
          visibility: "private",
          ordered: true,
        },
        "player1-inkwell": {
          id: "player1-inkwell",
          name: "inkwell",
          owner: "player1",
          cards: [],
          visibility: "private",
          ordered: false,
        },
        "player1-deck": {
          id: "player1-deck",
          name: "deck",
          owner: "player1",
          cards: ["card3", "card4"],
          visibility: "private",
          ordered: true,
        },
      },
    } as CoreCtx;
  });

  describe("moveCardByInstanceId", () => {
    describe("without from constraint", () => {
      it("should move card successfully when card exists", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "card1",
          playerId: "player1",
          to: "inkwell",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(false);
        if (!isZoneOperationError(result)) {
          expect(result.cardZones["player1-hand"].cards).toEqual(["card2"]);
          expect(result.cardZones["player1-inkwell"].cards).toEqual(["card1"]);
        }
      });

      it("should return error when card not found", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "nonexistent",
          playerId: "player1",
          to: "inkwell",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(true);
        if (isZoneOperationError(result)) {
          expect(result.reason).toBe("ZONE_NOT_FOUND");
          expect(result.context?.instanceId).toBe("nonexistent");
        }
      });

      it("should return error when target zone not found", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "card1",
          playerId: "player1",
          to: "nonexistent",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(true);
        if (isZoneOperationError(result)) {
          expect(result.reason).toBe("ZONE_NOT_FOUND");
          expect(result.context?.toZone).toBe("nonexistent");
        }
      });
    });

    describe("with from constraint", () => {
      it("should move card when it's in the expected zone", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "card1",
          playerId: "player1",
          to: "inkwell",
          from: "hand",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(false);
        if (!isZoneOperationError(result)) {
          expect(result.cardZones["player1-hand"].cards).toEqual(["card2"]);
          expect(result.cardZones["player1-inkwell"].cards).toEqual(["card1"]);
        }
      });

      it("should move card when using zone id as from constraint", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "card1",
          playerId: "player1",
          to: "inkwell",
          from: "player1-hand",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(false);
        if (!isZoneOperationError(result)) {
          expect(result.cardZones["player1-hand"].cards).toEqual(["card2"]);
          expect(result.cardZones["player1-inkwell"].cards).toEqual(["card1"]);
        }
      });

      it("should return error when card is not in expected zone", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "card3", // This card is in deck, not hand
          playerId: "player1",
          to: "inkwell",
          from: "hand",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(true);
        if (isZoneOperationError(result)) {
          expect(result.reason).toBe("CARD_NOT_IN_EXPECTED_ZONE");
          expect(result.context?.instanceId).toBe("card3");
          expect(result.context?.expectedZone).toBe("hand");
          expect(result.context?.actualZone).toBe("player1-deck");
          expect(result.context?.expectedOwner).toBe("player1");
          expect(result.context?.actualOwner).toBe("player1");
          expect(result.context?.playerId).toBe("player1");
        }
      });

      it("should return error when card is not in expected zone using zone id", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "card3",
          playerId: "player1",
          to: "inkwell",
          from: "player1-hand",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(true);
        if (isZoneOperationError(result)) {
          expect(result.reason).toBe("CARD_NOT_IN_EXPECTED_ZONE");
          expect(result.context?.expectedZone).toBe("player1-hand");
          expect(result.context?.actualZone).toBe("player1-deck");
        }
      });

      it("should return error when card does not exist but from constraint is provided", () => {
        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "nonexistent",
          playerId: "player1",
          to: "inkwell",
          from: "hand",
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(true);
        if (isZoneOperationError(result)) {
          expect(result.reason).toBe("CARD_NOT_IN_EXPECTED_ZONE");
          expect(result.context?.instanceId).toBe("nonexistent");
          expect(result.context?.expectedZone).toBe("hand");
          expect(result.context?.actualZone).toBeUndefined();
        }
      });

      it("should return error when card is in correct zone but owned by different player", () => {
        // Add player2's hand zone to mock context
        mockCtx.cardZones["player2-hand"] = {
          id: "player2-hand",
          name: "hand",
          owner: "player2",
          cards: ["player2-card1"],
          visibility: "private",
          ordered: true,
        };

        const result = moveCardByInstanceId({
          ctx: mockCtx,
          instanceId: "player2-card1", // Card is in player2's hand
          playerId: "player1", // But player1 is trying to move it
          to: "inkwell",
          from: "hand", // Zone name matches but ownership doesn't
          logCollector,
        });

        expect(isZoneOperationError(result)).toBe(true);
        if (isZoneOperationError(result)) {
          expect(result.reason).toBe("CARD_NOT_IN_EXPECTED_ZONE");
          expect(result.context?.instanceId).toBe("player2-card1");
          expect(result.context?.expectedZone).toBe("hand");
          expect(result.context?.actualZone).toBe("player2-hand");
          expect(result.context?.expectedOwner).toBe("player1");
          expect(result.context?.actualOwner).toBe("player2");
        }
      });
    });
  });

  describe("isZoneOperationError type guard", () => {
    it("should correctly identify ZoneOperationError", () => {
      const error: ZoneOperationError = {
        type: "ZONE_OPERATION_ERROR",
        reason: "TEST_ERROR",
        context: { test: true },
      };

      expect(isZoneOperationError(error)).toBe(true);
    });

    it("should correctly identify non-error objects", () => {
      expect(isZoneOperationError(mockCtx)).toBe(false);
      expect(isZoneOperationError(null)).toBe(false);
      expect(isZoneOperationError(undefined)).toBe(false);
      expect(isZoneOperationError("string")).toBe(false);
      expect(isZoneOperationError({ type: "OTHER_TYPE" })).toBe(false);
    });
  });
});
