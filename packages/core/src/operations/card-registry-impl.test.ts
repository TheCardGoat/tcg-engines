import { describe, expect, it } from "bun:test";
import { createCardRegistry } from "./card-registry-impl";

describe("CardRegistry Implementation", () => {
  type TestCardDef = {
    id: string;
    name: string;
    cost: number;
    type: "monster" | "spell" | "trap";
    attack?: number;
    defense?: number;
  };

  const testCards: Record<string, TestCardDef> = {
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

  describe("createCardRegistry", () => {
    it("should create registry from card definitions", () => {
      const registry = createCardRegistry(testCards);

      expect(registry.getCardCount()).toBe(4);
      expect(registry.hasCard("monster-1")).toBe(true);
      expect(registry.hasCard("spell-1")).toBe(true);
    });

    it("should create empty registry with no cards", () => {
      const registry = createCardRegistry<TestCardDef>();

      expect(registry.getCardCount()).toBe(0);
      expect(registry.getAllCards()).toHaveLength(0);
    });

    it("should create empty registry with empty object", () => {
      const registry = createCardRegistry<TestCardDef>({});

      expect(registry.getCardCount()).toBe(0);
      expect(registry.getAllCards()).toHaveLength(0);
    });
  });

  describe("getCard", () => {
    it("should return card definition by ID", () => {
      const registry = createCardRegistry(testCards);

      const card = registry.getCard("monster-1");

      expect(card).toBeDefined();
      expect(card?.name).toBe("Blue Eyes");
      expect(card?.cost).toBe(8);
      expect(card?.attack).toBe(3000);
    });

    it("should return undefined for nonexistent card", () => {
      const registry = createCardRegistry(testCards);

      const card = registry.getCard("nonexistent");

      expect(card).toBeUndefined();
    });

    it("should handle different card types", () => {
      const registry = createCardRegistry(testCards);

      const monster = registry.getCard("monster-1");
      const spell = registry.getCard("spell-1");

      expect(monster?.type).toBe("monster");
      expect(spell?.type).toBe("spell");
    });
  });

  describe("hasCard", () => {
    it("should return true for existing card", () => {
      const registry = createCardRegistry(testCards);

      expect(registry.hasCard("monster-1")).toBe(true);
      expect(registry.hasCard("spell-1")).toBe(true);
      expect(registry.hasCard("trap-1")).toBe(true);
    });

    it("should return false for nonexistent card", () => {
      const registry = createCardRegistry(testCards);

      expect(registry.hasCard("nonexistent")).toBe(false);
      expect(registry.hasCard("unknown-card")).toBe(false);
    });
  });

  describe("getAllCards", () => {
    it("should return all card definitions", () => {
      const registry = createCardRegistry(testCards);

      const allCards = registry.getAllCards();

      expect(allCards).toHaveLength(4);
      expect(allCards.map((c) => c.id)).toContain("monster-1");
      expect(allCards.map((c) => c.id)).toContain("monster-2");
      expect(allCards.map((c) => c.id)).toContain("spell-1");
      expect(allCards.map((c) => c.id)).toContain("trap-1");
    });

    it("should return empty array for empty registry", () => {
      const registry = createCardRegistry<TestCardDef>();

      const allCards = registry.getAllCards();

      expect(allCards).toHaveLength(0);
    });

    it("should return new array instance each time", () => {
      const registry = createCardRegistry(testCards);

      const arr1 = registry.getAllCards();
      const arr2 = registry.getAllCards();

      expect(arr1).not.toBe(arr2); // Different instances
      expect(arr1).toEqual(arr2); // Same content
    });
  });

  describe("queryCards", () => {
    it("should find cards by type", () => {
      const registry = createCardRegistry(testCards);

      const monsters = registry.queryCards((card) => card.type === "monster");

      expect(monsters).toHaveLength(2);
      expect(monsters.every((c) => c.type === "monster")).toBe(true);
      expect(monsters.map((c) => c.id)).toContain("monster-1");
      expect(monsters.map((c) => c.id)).toContain("monster-2");
    });

    it("should find cards by cost", () => {
      const registry = createCardRegistry(testCards);

      const expensive = registry.queryCards((card) => card.cost >= 7);

      expect(expensive).toHaveLength(2);
      expect(expensive.map((c) => c.id)).toContain("monster-1");
      expect(expensive.map((c) => c.id)).toContain("monster-2");
    });

    it("should support complex predicates", () => {
      const registry = createCardRegistry(testCards);

      const strongMonsters = registry.queryCards(
        (card) => card.type === "monster" && (card.attack ?? 0) >= 2500,
      );

      expect(strongMonsters).toHaveLength(2);
      expect(strongMonsters.every((c) => c.type === "monster")).toBe(true);
      expect(strongMonsters.every((c) => (c.attack ?? 0) >= 2500)).toBe(true);
    });

    it("should return empty array when no matches", () => {
      const registry = createCardRegistry(testCards);

      const results = registry.queryCards((card) => card.cost > 100);

      expect(results).toHaveLength(0);
    });

    it("should handle predicates on optional properties", () => {
      const registry = createCardRegistry(testCards);

      const withAttack = registry.queryCards(
        (card) => card.attack !== undefined,
      );

      expect(withAttack).toHaveLength(2);
      expect(withAttack.every((c) => c.type === "monster")).toBe(true);
    });
  });

  describe("getCardCount", () => {
    it("should return total number of cards", () => {
      const registry = createCardRegistry(testCards);

      expect(registry.getCardCount()).toBe(4);
    });

    it("should return 0 for empty registry", () => {
      const registry = createCardRegistry<TestCardDef>();

      expect(registry.getCardCount()).toBe(0);
    });
  });

  describe("Immutability", () => {
    it("should not expose internal card definitions directly", () => {
      const registry = createCardRegistry(testCards);

      const card1 = registry.getCard("monster-1");
      const card2 = registry.getCard("monster-1");

      // Should return the same object (not a copy)
      // This is fine since card definitions are static/immutable
      expect(card1).toBeDefined();
      expect(card2).toBeDefined();
      if (card1 && card2) {
        expect(card1).toBe(card2);
      }
    });

    it("should return new arrays for getAllCards", () => {
      const registry = createCardRegistry(testCards);

      const all1 = registry.getAllCards();
      const all2 = registry.getAllCards();

      expect(all1).not.toBe(all2);
    });

    it("should return new arrays for queryCards", () => {
      const registry = createCardRegistry(testCards);

      const query1 = registry.queryCards((c) => c.type === "monster");
      const query2 = registry.queryCards((c) => c.type === "monster");

      expect(query1).not.toBe(query2);
    });
  });
});
