import { describe, expect, it } from "bun:test";
import type { CardInstanceId, GameId, PlayerId, ZoneId } from "./branded";
import {
  createCardId,
  createGameId,
  createPlayerId,
  createZoneId,
  asCardInstanceId,
  asPlayerId,
  asZoneId,
  asGameId,
  asCardInstanceIdOptional,
  asPlayerIdOptional,
  asZoneIdOptional,
  asCardInstanceIds,
} from "./branded-utils";

describe("Branded Types", () => {
  describe("createCardId", () => {
    it("should create a CardId from a string literal", () => {
      const cardId = createCardId("card-123");
      expect(typeof cardId).toBe("string");
      // Runtime value should match the input
      expect(String(cardId)).toBe("card-123");
      // Type assertion to verify it's properly typed
      const _typeCheck: CardInstanceId = cardId;
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
      const cardId: CardInstanceId = createCardId("card-123");
      const acceptsCardId = (id: CardInstanceId): CardInstanceId => id;

      expect(acceptsCardId(cardId)).toBe(cardId);
    });

    it("should work with arrays and collections", () => {
      const cardIds: CardInstanceId[] = [createCardId("1"), createCardId("2"), createCardId("3")];

      expect(cardIds).toHaveLength(3);
      expect(cardIds.every((id) => typeof id === "string")).toBe(true);
    });

    it("should work with Set and Map", () => {
      const cardIdSet = new Set<CardInstanceId>([createCardId("1"), createCardId("2")]);
      const cardIdMap = new Map<CardInstanceId, string>([
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

describe("Safe Casting Helpers", () => {
  describe("asCardInstanceId", () => {
    it("should cast string to CardInstanceId", () => {
      const id = "card-123";
      const cardId = asCardInstanceId(id);
      // Type assertion to verify it's properly typed
      const _typeCheck: CardInstanceId = cardId;
      expect(typeof cardId).toBe("string");
      expect(cardId).toBe(id as CardInstanceId);
    });
  });

  describe("asPlayerId", () => {
    it("should cast string to PlayerId", () => {
      const id = "player-456";
      const playerId = asPlayerId(id);
      const _typeCheck: PlayerId = playerId;
      expect(typeof playerId).toBe("string");
      expect(playerId).toBe(id as PlayerId);
    });
  });

  describe("asZoneId", () => {
    it("should cast string to ZoneId", () => {
      const id = "zone-789";
      const zoneId = asZoneId(id);
      const _typeCheck: ZoneId = zoneId;
      expect(typeof zoneId).toBe("string");
      expect(zoneId).toBe(id as ZoneId);
    });
  });

  describe("asGameId", () => {
    it("should cast string to GameId", () => {
      const id = "game-abc";
      const gameId = asGameId(id);
      const _typeCheck: GameId = gameId;
      expect(typeof gameId).toBe("string");
      expect(gameId).toBe(id as GameId);
    });
  });

  describe("Optional casting helpers", () => {
    it("asCardInstanceIdOptional should return undefined for empty input", () => {
      expect(asCardInstanceIdOptional(null)).toBeUndefined();
      expect(asCardInstanceIdOptional(undefined)).toBeUndefined();
      expect(asCardInstanceIdOptional("")).toBeUndefined();
    });

    it("asCardInstanceIdOptional should cast non-empty strings", () => {
      const cardId = asCardInstanceIdOptional("card-123");
      const _typeCheck: CardInstanceId | undefined = cardId;
      expect(cardId).toBe("card-123" as CardInstanceId);
    });

    it("asPlayerIdOptional should return undefined for empty input", () => {
      expect(asPlayerIdOptional(null)).toBeUndefined();
      expect(asPlayerIdOptional(undefined)).toBeUndefined();
    });

    it("asPlayerIdOptional should cast non-empty strings", () => {
      const playerId = asPlayerIdOptional("player-456");
      const _typeCheck: PlayerId | undefined = playerId;
      expect(playerId).toBe("player-456" as PlayerId);
    });

    it("asZoneIdOptional should return undefined for empty input", () => {
      expect(asZoneIdOptional(null)).toBeUndefined();
      expect(asZoneIdOptional(undefined)).toBeUndefined();
    });

    it("asZoneIdOptional should cast non-empty strings", () => {
      const zoneId = asZoneIdOptional("zone-789");
      const _typeCheck: ZoneId | undefined = zoneId;
      expect(zoneId).toBe("zone-789" as ZoneId);
    });
  });

  describe("asCardInstanceIds", () => {
    it("should cast string array to CardInstanceId array", () => {
      const ids = ["card-1", "card-2", "card-3"];
      const cardIds = asCardInstanceIds(ids);
      const _typeCheck: CardInstanceId[] = cardIds;
      expect(cardIds).toHaveLength(3);
      expect(cardIds).toEqual(ids as CardInstanceId[]);
    });

    it("should handle empty arrays", () => {
      const cardIds = asCardInstanceIds([]);
      expect(cardIds).toHaveLength(0);
    });
  });
});
