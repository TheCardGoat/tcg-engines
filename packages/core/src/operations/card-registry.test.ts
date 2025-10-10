import { describe, expect, it } from "bun:test";
import type { CardRegistry } from "./card-registry";

describe("CardRegistry Interface", () => {
  // Mock card definition type for testing
  type TestCardDef = {
    id: string;
    name: string;
    cost: number;
    type: "monster" | "spell" | "trap";
    attack?: number;
    defense?: number;
  };

  // Mock implementation for testing the interface structure
  const createMockCardRegistry = (): CardRegistry<TestCardDef> => {
    const cards: Record<string, TestCardDef> = {
      "monster-1": {
        id: "monster-1",
        name: "Blue Eyes",
        cost: 8,
        type: "monster",
        attack: 3000,
        defense: 2500,
      },
      "monster-2": {
        id: "monster-2",
        name: "Dark Magician",
        cost: 7,
        type: "monster",
        attack: 2500,
        defense: 2100,
      },
      "spell-1": {
        id: "spell-1",
        name: "Lightning Bolt",
        cost: 1,
        type: "spell",
      },
      "trap-1": {
        id: "trap-1",
        name: "Mirror Force",
        cost: 3,
        type: "trap",
      },
    };

    return {
      getCard: (definitionId) => {
        return cards[definitionId];
      },

      hasCard: (definitionId) => {
        return definitionId in cards;
      },

      getAllCards: () => {
        return Object.values(cards);
      },

      queryCards: (predicate) => {
        return Object.values(cards).filter(predicate);
      },

      getCardCount: () => {
        return Object.keys(cards).length;
      },
    };
  };

  describe("getCard", () => {
    it("should return card definition by ID", () => {
      const registry = createMockCardRegistry();

      const card = registry.getCard("monster-1");

      expect(card).toBeDefined();
      expect(card?.name).toBe("Blue Eyes");
      expect(card?.cost).toBe(8);
      expect(card?.attack).toBe(3000);
    });

    it("should return undefined for nonexistent card", () => {
      const registry = createMockCardRegistry();

      const card = registry.getCard("nonexistent");

      expect(card).toBeUndefined();
    });

    it("should handle different card types", () => {
      const registry = createMockCardRegistry();

      const monster = registry.getCard("monster-1");
      const spell = registry.getCard("spell-1");

      expect(monster?.type).toBe("monster");
      expect(spell?.type).toBe("spell");
    });
  });

  describe("hasCard", () => {
    it("should return true for existing card", () => {
      const registry = createMockCardRegistry();

      expect(registry.hasCard("monster-1")).toBe(true);
      expect(registry.hasCard("spell-1")).toBe(true);
    });

    it("should return false for nonexistent card", () => {
      const registry = createMockCardRegistry();

      expect(registry.hasCard("nonexistent")).toBe(false);
    });
  });

  describe("getAllCards", () => {
    it("should return all card definitions", () => {
      const registry = createMockCardRegistry();

      const allCards = registry.getAllCards();

      expect(allCards).toHaveLength(4);
      expect(allCards.map((c) => c.id)).toContain("monster-1");
      expect(allCards.map((c) => c.id)).toContain("spell-1");
      expect(allCards.map((c) => c.id)).toContain("trap-1");
    });

    it("should return empty array for empty registry", () => {
      const emptyRegistry: CardRegistry<TestCardDef> = {
        getCard: () => undefined,
        hasCard: () => false,
        getAllCards: () => [],
        queryCards: () => [],
        getCardCount: () => 0,
      };

      const allCards = emptyRegistry.getAllCards();

      expect(allCards).toHaveLength(0);
    });
  });

  describe("queryCards", () => {
    it("should find cards by type", () => {
      const registry = createMockCardRegistry();

      const monsters = registry.queryCards((card) => card.type === "monster");

      expect(monsters).toHaveLength(2);
      expect(monsters.every((c) => c.type === "monster")).toBe(true);
    });

    it("should find cards by cost", () => {
      const registry = createMockCardRegistry();

      const expensive = registry.queryCards((card) => card.cost >= 7);

      expect(expensive).toHaveLength(2);
      expect(expensive.map((c) => c.id)).toContain("monster-1");
      expect(expensive.map((c) => c.id)).toContain("monster-2");
    });

    it("should support complex predicates", () => {
      const registry = createMockCardRegistry();

      const strongMonsters = registry.queryCards(
        (card) => card.type === "monster" && (card.attack ?? 0) >= 2500,
      );

      expect(strongMonsters).toHaveLength(2);
      expect(strongMonsters.every((c) => c.type === "monster")).toBe(true);
    });

    it("should return empty array when no matches", () => {
      const registry = createMockCardRegistry();

      const results = registry.queryCards((card) => card.cost > 100);

      expect(results).toHaveLength(0);
    });
  });

  describe("getCardCount", () => {
    it("should return total number of cards", () => {
      const registry = createMockCardRegistry();

      expect(registry.getCardCount()).toBe(4);
    });

    it("should return 0 for empty registry", () => {
      const emptyRegistry: CardRegistry<TestCardDef> = {
        getCard: () => undefined,
        hasCard: () => false,
        getAllCards: () => [],
        queryCards: () => [],
        getCardCount: () => 0,
      };

      expect(emptyRegistry.getCardCount()).toBe(0);
    });
  });

  describe("Type Safety", () => {
    it("should enforce generic card definition type", () => {
      const registry = createMockCardRegistry();

      // This is a compile-time test - card should have TestCardDef shape
      const card = registry.getCard("monster-1");

      if (card) {
        expect(card.id).toBeDefined();
        expect(card.name).toBeDefined();
        expect(card.cost).toBeDefined();
        expect(card.type).toBeDefined();
      }
    });

    it("should support optional properties in card definitions", () => {
      const registry = createMockCardRegistry();

      const monster = registry.getCard("monster-1");
      const spell = registry.getCard("spell-1");

      // Monsters have attack/defense
      expect(monster?.attack).toBeDefined();
      expect(monster?.defense).toBeDefined();

      // Spells don't
      expect(spell?.attack).toBeUndefined();
      expect(spell?.defense).toBeUndefined();
    });
  });
});
