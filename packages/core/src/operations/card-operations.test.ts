import { describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "../types";
import type { CardOperations } from "./card-operations";

describe("CardOperations Interface", () => {
  // Mock card metadata type for testing
  interface TestCardMeta {
    damage?: number;
    exerted?: boolean;
    counters?: number;
    effects?: string[];
  }

  // Mock implementation for testing the interface structure
  const createMockCardOperations = (): CardOperations<TestCardMeta> => {
    const cardMetas: Record<string, TestCardMeta> = {
      "card-1": { damage: 0, exerted: false },
      "card-2": { counters: 5, damage: 3, exerted: true },
    };

    const cardOwners: Record<string, string> = {
      "card-1": "player-1",
      "card-2": "player-2",
    };

    return {
      getCardMeta: (cardId) => cardMetas[cardId] || {},

      getCardOwner: (cardId) => cardOwners[cardId] as unknown as PlayerId | undefined,

      queryCards: (predicate) => {
        const results: CardId[] = [];
        for (const cardId in cardMetas) {
          if (predicate(cardId as CardId, cardMetas[cardId])) {
            results.push(cardId as CardId);
          }
        }
        return results;
      },

      setCardMeta: (cardId, meta) => {
        cardMetas[cardId] = meta;
      },

      updateCardMeta: (cardId, meta) => {
        if (!cardMetas[cardId]) {
          cardMetas[cardId] = {};
        }
        Object.assign(cardMetas[cardId], meta);
      },
    };
  };

  describe("getCardMeta", () => {
    it("should return card metadata", () => {
      const ops = createMockCardOperations();

      const meta = ops.getCardMeta("card-1" as CardId);

      expect(meta.damage).toBe(0);
      expect(meta.exerted).toBe(false);
    });

    it("should return empty object for card without metadata", () => {
      const ops = createMockCardOperations();

      const meta = ops.getCardMeta("nonexistent-card" as CardId);

      expect(meta).toEqual({});
    });

    it("should return partial metadata", () => {
      const ops = createMockCardOperations();

      const meta = ops.getCardMeta("card-2" as CardId);

      expect(meta.damage).toBe(3);
      expect(meta.exerted).toBe(true);
      expect(meta.counters).toBe(5);
    });
  });

  describe("updateCardMeta", () => {
    it("should merge new metadata with existing", () => {
      const ops = createMockCardOperations();

      ops.updateCardMeta("card-1" as CardId, { damage: 2 });
      const meta = ops.getCardMeta("card-1" as CardId);

      expect(meta.damage).toBe(2);
      expect(meta.exerted).toBe(false); // Preserved
    });

    it("should add new properties to existing metadata", () => {
      const ops = createMockCardOperations();

      ops.updateCardMeta("card-1" as CardId, { counters: 3 });
      const meta = ops.getCardMeta("card-1" as CardId);

      expect(meta.counters).toBe(3);
      expect(meta.damage).toBe(0); // Preserved
      expect(meta.exerted).toBe(false); // Preserved
    });

    it("should create metadata for card without existing metadata", () => {
      const ops = createMockCardOperations();

      ops.updateCardMeta("card-3" as CardId, { damage: 5 });
      const meta = ops.getCardMeta("card-3" as CardId);

      expect(meta.damage).toBe(5);
    });
  });

  describe("setCardMeta", () => {
    it("should replace existing metadata completely", () => {
      const ops = createMockCardOperations();

      ops.setCardMeta("card-2" as CardId, { damage: 10 });
      const meta = ops.getCardMeta("card-2" as CardId);

      expect(meta.damage).toBe(10);
      expect(meta.exerted).toBeUndefined(); // Removed
      expect(meta.counters).toBeUndefined(); // Removed
    });

    it("should set metadata for new card", () => {
      const ops = createMockCardOperations();

      ops.setCardMeta("card-3" as CardId, { damage: 7, exerted: true });
      const meta = ops.getCardMeta("card-3" as CardId);

      expect(meta.damage).toBe(7);
      expect(meta.exerted).toBe(true);
    });
  });

  describe("getCardOwner", () => {
    it("should return the owner of a card", () => {
      const ops = createMockCardOperations();

      const owner = ops.getCardOwner("card-1" as CardId);

      expect(owner).toBe("player-1" as unknown as PlayerId);
    });

    it("should return undefined for card without owner", () => {
      const ops = createMockCardOperations();

      const owner = ops.getCardOwner("nonexistent-card" as CardId);

      expect(owner).toBeUndefined();
    });
  });

  describe("queryCards", () => {
    it("should find cards matching a predicate", () => {
      const ops = createMockCardOperations();

      const exertedCards = ops.queryCards((cardId, meta) => meta.exerted === true);

      expect(exertedCards).toHaveLength(1);
      expect(exertedCards).toContain("card-2");
    });

    it("should find cards with specific damage", () => {
      const ops = createMockCardOperations();

      const damagedCards = ops.queryCards((cardId, meta) => (meta.damage ?? 0) > 0);

      expect(damagedCards).toHaveLength(1);
      expect(damagedCards).toContain("card-2");
    });

    it("should return empty array when no cards match", () => {
      const ops = createMockCardOperations();

      const results = ops.queryCards((cardId, meta) => meta.counters === 999);

      expect(results).toHaveLength(0);
    });

    it("should support complex predicates", () => {
      const ops = createMockCardOperations();

      const results = ops.queryCards(
        (cardId, meta) =>
          (meta.damage ?? 0) > 0 && meta.exerted === true && (meta.counters ?? 0) >= 5,
      );

      expect(results).toHaveLength(1);
      expect(results).toContain("card-2");
    });
  });

  describe("Type Safety", () => {
    it("should enforce CardId type for card identifiers", () => {
      const ops = createMockCardOperations();

      // This is a compile-time test
      const meta = ops.getCardMeta("card-1" as unknown as CardId);

      expect(meta).toBeDefined();
    });

    it("should enforce PlayerId type for owner", () => {
      const ops = createMockCardOperations();

      // This is a compile-time test
      const owner = ops.getCardOwner("card-1" as unknown as CardId);

      expect(owner !== undefined ? typeof owner : "undefined").toBe("string");
    });

    it("should enforce generic metadata type", () => {
      const ops = createMockCardOperations();

      // This is a compile-time test - metadata should have TestCardMeta shape
      const meta = ops.getCardMeta("card-1" as unknown as CardId);

      // These properties should exist on TestCardMeta
      expect(typeof meta.damage).toBe("number");
      expect(typeof meta.exerted).toBe("boolean");
    });
  });
});
