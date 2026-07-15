import { describe, expect, it } from "bun:test";
import type { CardId, GameId, PlayerId, ZoneId } from "./branded";
import { createCardId, createGameId, createPlayerId, createZoneId } from "./branded-utils";

describe("Branded Types", () => {
  describe("createCardId", () => {
    it("should create a CardId from a string literal", () => {
      const cardId = createCardId("card-123");
      expect(typeof cardId).toBe("string");
      // Runtime value should match the input
      expect(String(cardId)).toBe("card-123");
      // Type assertion to verify it's properly typed
      const _typeCheck: CardId = cardId;
    });

    it("should generate unique IDs when called without arguments", () => {
      const id1 = createCardId();
      const id2 = createCardId();
      expect(id1).not.toBe(id2);
    });

    it("should generate IDs with proper format", () => {
      const cardId = createCardId();
      expect(typeof cardId).toBe("string");
      expect(cardId.length).toBeGreaterThan(0);
    });
  });

  describe("createPlayerId", () => {
    it("should create a PlayerId from a string literal", () => {
      const playerId = createPlayerId("player-456");
      expect(typeof playerId).toBe("string");
      // Runtime value should match the input
      expect(String(playerId)).toBe("player-456");
      // Type assertion to verify it's properly typed
      const _typeCheck: PlayerId = playerId;
    });

    it("should generate unique IDs when called without arguments", () => {
      const id1 = createPlayerId();
      const id2 = createPlayerId();
      expect(id1).not.toBe(id2);
    });

    it("should generate IDs with proper format", () => {
      const playerId = createPlayerId();
      expect(typeof playerId).toBe("string");
      expect(playerId.length).toBeGreaterThan(0);
    });
  });

  describe("createGameId", () => {
    it("should create a GameId from a string literal", () => {
      const gameId = createGameId("game-789");
      expect(typeof gameId).toBe("string");
      // Runtime value should match the input
      expect(String(gameId)).toBe("game-789");
      // Type assertion to verify it's properly typed
      const _typeCheck: GameId = gameId;
    });

    it("should generate unique IDs when called without arguments", () => {
      const id1 = createGameId();
      const id2 = createGameId();
      expect(id1).not.toBe(id2);
    });

    it("should generate IDs with proper format", () => {
      const gameId = createGameId();
      expect(typeof gameId).toBe("string");
      expect(gameId.length).toBeGreaterThan(0);
    });
  });

  describe("createZoneId", () => {
    it("should create a ZoneId from a string literal", () => {
      const zoneId = createZoneId("zone-abc");
      expect(typeof zoneId).toBe("string");
      // Runtime value should match the input
      expect(String(zoneId)).toBe("zone-abc");
      // Type assertion to verify it's properly typed
      const _typeCheck: ZoneId = zoneId;
    });

    it("should generate unique IDs when called without arguments", () => {
      const id1 = createZoneId();
      const id2 = createZoneId();
      expect(id1).not.toBe(id2);
    });

    it("should generate IDs with proper format", () => {
      const zoneId = createZoneId();
      expect(typeof zoneId).toBe("string");
      expect(zoneId.length).toBeGreaterThan(0);
    });
  });

  describe("Type Safety", () => {
    it("should prevent mixing different ID types at compile time", () => {
      const cardId = createCardId("id-1");
      const playerId = createPlayerId("id-2");

      // This test verifies type safety at compile time
      // The following would fail TypeScript compilation:
      // Const wrongAssignment1: CardId = playerId;
      // Const wrongAssignment2: PlayerId = cardId;

      // But we can verify runtime values are still just strings
      expect(typeof cardId).toBe("string");
      expect(typeof playerId).toBe("string");
    });

    it("should allow assignment of branded types to their brand type", () => {
      const cardId: CardId = createCardId("card-123");
      const acceptsCardId = (id: CardId): CardId => id;

      expect(acceptsCardId(cardId)).toBe(cardId);
    });

    it("should work with arrays and collections", () => {
      const cardIds: CardId[] = [createCardId("1"), createCardId("2"), createCardId("3")];

      expect(cardIds).toHaveLength(3);
      expect(cardIds.every((id) => typeof id === "string")).toBe(true);
    });

    it("should work with Set and Map", () => {
      const cardIdSet = new Set<CardId>([createCardId("1"), createCardId("2")]);
      const cardIdMap = new Map<CardId, string>([
        [createCardId("1"), "Card One"],
        [createCardId("2"), "Card Two"],
      ]);

      expect(cardIdSet.size).toBe(2);
      expect(cardIdMap.size).toBe(2);
    });
  });

  describe("ID Generation Consistency", () => {
    it("should generate IDs of consistent length", () => {
      const ids = [createCardId(), createPlayerId(), createGameId(), createZoneId()];

      const lengths = ids.map((id) => id.length);
      expect(new Set(lengths).size).toBe(1); // All same length
    });

    it("should generate URL-safe IDs", () => {
      const ids = [createCardId(), createPlayerId(), createGameId(), createZoneId()];

      for (const id of ids) {
        // Nanoid generates URL-safe characters: A-Za-z0-9_-
        expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
      }
    });
  });
});
