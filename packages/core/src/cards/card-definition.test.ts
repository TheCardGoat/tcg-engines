import { describe, expect, it } from "bun:test";
import { createCardRegistry } from "../operations/card-registry-impl";
import type { CardDefinition } from "./card-definition";

describe("Card Definition", () => {
  describe("CardDefinition Type", () => {
    it("should define static card data with all required fields", () => {
      const definition: CardDefinition = {
        id: "fire-bolt",
        name: "Fire Bolt",
        type: "instant",
      };

      expect(definition.id).toBe("fire-bolt");
      expect(definition.name).toBe("Fire Bolt");
      expect(definition.type).toBe("instant");
    });

    it("should support optional basePower field", () => {
      const definition: CardDefinition = {
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
        basePower: 2,
      };

      expect(definition.basePower).toBe(2);
    });

    it("should support optional baseToughness field", () => {
      const definition: CardDefinition = {
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
        baseToughness: 2,
      };

      expect(definition.baseToughness).toBe(2);
    });

    it("should support optional baseCost field", () => {
      const definition: CardDefinition = {
        id: "fire-bolt",
        name: "Fire Bolt",
        type: "instant",
        baseCost: 1,
      };

      expect(definition.baseCost).toBe(1);
    });

    it("should support abilities array", () => {
      const definition: CardDefinition = {
        id: "serra-angel",
        name: "Serra Angel",
        type: "creature",
        abilities: ["flying", "vigilance"],
      };

      expect(definition.abilities).toHaveLength(2);
      expect(definition.abilities).toContain("flying");
      expect(definition.abilities).toContain("vigilance");
    });

    it("should work with empty abilities array", () => {
      const definition: CardDefinition = {
        id: "vanilla-creature",
        name: "Vanilla Creature",
        type: "creature",
        abilities: [],
      };

      expect(definition.abilities).toHaveLength(0);
    });

    it("should support all fields together", () => {
      const definition: CardDefinition = {
        id: "lightning-dragon",
        name: "Lightning Dragon",
        type: "creature",
        basePower: 4,
        baseToughness: 4,
        baseCost: 4,
        abilities: ["flying", "haste"],
      };

      expect(definition.id).toBe("lightning-dragon");
      expect(definition.name).toBe("Lightning Dragon");
      expect(definition.type).toBe("creature");
      expect(definition.basePower).toBe(4);
      expect(definition.baseToughness).toBe(4);
      expect(definition.baseCost).toBe(4);
      expect(definition.abilities).toHaveLength(2);
    });
  });

  describe("Card Registry", () => {
    it("should create empty registry", () => {
      const registry = createCardRegistry<CardDefinition>([]);
      expect(registry).toBeDefined();
      expect(registry.getCardCount()).toBe(0);
    });

    it("should register single card definition", () => {
      const definition: CardDefinition = {
        id: "fire-bolt",
        name: "Fire Bolt",
        type: "instant",
        baseCost: 1,
        abilities: [],
      };

      const registry = createCardRegistry([definition]);
      const retrieved = registry.getCard("fire-bolt");

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe("fire-bolt");
      expect(retrieved?.name).toBe("Fire Bolt");
    });

    it("should register multiple card definitions", () => {
      const definitions: CardDefinition[] = [
        {
          id: "fire-bolt",
          name: "Fire Bolt",
          type: "instant",
          baseCost: 1,
          abilities: [],
        },
        {
          id: "grizzly-bears",
          name: "Grizzly Bears",
          type: "creature",
          basePower: 2,
          baseToughness: 2,
          baseCost: 2,
          abilities: [],
        },
      ];

      const registry = createCardRegistry(definitions);

      const fireBolt = registry.getCard("fire-bolt");
      const bears = registry.getCard("grizzly-bears");

      expect(fireBolt?.name).toBe("Fire Bolt");
      expect(bears?.name).toBe("Grizzly Bears");
    });

    it("should return undefined for non-existent definition", () => {
      const registry = createCardRegistry<CardDefinition>([]);
      const retrieved = registry.getCard("non-existent");

      expect(retrieved).toBeUndefined();
    });

    it("should overwrite duplicate definitions with last one", () => {
      const definitions: CardDefinition[] = [
        {
          id: "fire-bolt",
          name: "Fire Bolt V1",
          type: "instant",
          baseCost: 1,
          abilities: [],
        },
        {
          id: "fire-bolt",
          name: "Fire Bolt V2",
          type: "instant",
          baseCost: 2,
          abilities: [],
        },
      ];

      const registry = createCardRegistry(definitions);
      const retrieved = registry.getCard("fire-bolt");

      expect(retrieved?.name).toBe("Fire Bolt V2");
      expect(retrieved?.baseCost).toBe(2);
    });
  });

  describe("CardRegistry.getCard", () => {
    it("should retrieve definition by id", () => {
      const definition: CardDefinition = {
        id: "test-card",
        name: "Test Card",
        type: "creature",
        abilities: [],
      };

      const registry = createCardRegistry([definition]);
      const retrieved = registry.getCard("test-card");

      expect(retrieved).toEqual(definition);
    });

    it("should be case-sensitive for ids", () => {
      const definition: CardDefinition = {
        id: "TestCard",
        name: "Test Card",
        type: "creature",
        abilities: [],
      };

      const registry = createCardRegistry([definition]);

      expect(registry.getCard("TestCard")).toBeDefined();
      expect(registry.getCard("testcard")).toBeUndefined();
    });

    it("should handle definitions with zero values", () => {
      const definition: CardDefinition = {
        id: "zero-cost",
        name: "Zero Cost Card",
        type: "instant",
        baseCost: 0,
        abilities: [],
      };

      const registry = createCardRegistry([definition]);
      const retrieved = registry.getCard("zero-cost");

      expect(retrieved?.baseCost).toBe(0);
    });
  });

  describe("CardRegistry additional methods", () => {
    it("should check if card exists with hasCard", () => {
      const registry = createCardRegistry([
        { id: "card1", name: "Card 1", type: "creature" },
      ]);

      expect(registry.hasCard("card1")).toBe(true);
      expect(registry.hasCard("nonexistent")).toBe(false);
    });

    it("should get all cards with getAllCards", () => {
      const registry = createCardRegistry([
        { id: "card1", name: "Card 1", type: "creature" },
        { id: "card2", name: "Card 2", type: "instant" },
      ]);

      const allCards = registry.getAllCards();
      expect(allCards).toHaveLength(2);
    });

    it("should query cards with predicate", () => {
      const registry = createCardRegistry([
        { id: "card1", name: "Card 1", type: "creature" },
        { id: "card2", name: "Card 2", type: "instant" },
        { id: "card3", name: "Card 3", type: "creature" },
      ]);

      const creatures = registry.queryCards((card) => card.type === "creature");
      expect(creatures).toHaveLength(2);
    });

    it("should return card count", () => {
      const registry = createCardRegistry([
        { id: "card1", name: "Card 1", type: "creature" },
        { id: "card2", name: "Card 2", type: "instant" },
      ]);

      expect(registry.getCardCount()).toBe(2);
    });
  });
});
