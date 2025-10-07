import { describe, expect, it } from "bun:test";
import type { CardDefinition } from "./card-definition";
import { createDefinitionRegistry, getCardDefinition } from "./card-definition";

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

  describe("Card Definition Registry", () => {
    it("should create empty registry", () => {
      const registry = createDefinitionRegistry([]);
      expect(registry).toBeDefined();
    });

    it("should register single card definition", () => {
      const definition: CardDefinition = {
        id: "fire-bolt",
        name: "Fire Bolt",
        type: "instant",
        baseCost: 1,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);
      const retrieved = getCardDefinition(registry, "fire-bolt");

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

      const registry = createDefinitionRegistry(definitions);

      const fireBolt = getCardDefinition(registry, "fire-bolt");
      const bears = getCardDefinition(registry, "grizzly-bears");

      expect(fireBolt?.name).toBe("Fire Bolt");
      expect(bears?.name).toBe("Grizzly Bears");
    });

    it("should return undefined for non-existent definition", () => {
      const registry = createDefinitionRegistry([]);
      const retrieved = getCardDefinition(registry, "non-existent");

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

      const registry = createDefinitionRegistry(definitions);
      const retrieved = getCardDefinition(registry, "fire-bolt");

      expect(retrieved?.name).toBe("Fire Bolt V2");
      expect(retrieved?.baseCost).toBe(2);
    });
  });

  describe("getCardDefinition", () => {
    it("should retrieve definition by id", () => {
      const definition: CardDefinition = {
        id: "test-card",
        name: "Test Card",
        type: "creature",
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);
      const retrieved = getCardDefinition(registry, "test-card");

      expect(retrieved).toEqual(definition);
    });

    it("should be case-sensitive for ids", () => {
      const definition: CardDefinition = {
        id: "TestCard",
        name: "Test Card",
        type: "creature",
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      expect(getCardDefinition(registry, "TestCard")).toBeDefined();
      expect(getCardDefinition(registry, "testcard")).toBeUndefined();
    });

    it("should handle definitions with zero values", () => {
      const definition: CardDefinition = {
        id: "zero-cost",
        name: "Zero Cost Card",
        type: "instant",
        baseCost: 0,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);
      const retrieved = getCardDefinition(registry, "zero-cost");

      expect(retrieved?.baseCost).toBe(0);
    });
  });
});
