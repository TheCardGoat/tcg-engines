import { describe, expect, it } from "bun:test";
import { createTypeGuard } from "./type-guard-builder";

describe("createTypeGuard", () => {
  describe("basic type guards", () => {
    it("should create a type guard for a string field", () => {
      interface Card { type: string; name: string }
      const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");

      const creature: Card = { name: "Dragon", type: "creature" };
      const instant: Card = { name: "Lightning Bolt", type: "instant" };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(instant)).toBe(false);
    });

    it("should create a type guard for a number field", () => {
      interface Item { id: number; category: string }
      const isItem42 = createTypeGuard<Item, "id", 42>("id", 42);

      const item42: Item = { category: "test", id: 42 };
      const item10: Item = { category: "test", id: 10 };

      expect(isItem42(item42)).toBe(true);
      expect(isItem42(item10)).toBe(false);
    });

    it("should create a type guard for a boolean field", () => {
      interface Config { enabled: boolean; name: string }
      const isEnabled = createTypeGuard<Config, "enabled", true>("enabled", true);

      const enabledConfig: Config = { enabled: true, name: "test" };
      const disabledConfig: Config = { enabled: false, name: "test" };

      expect(isEnabled(enabledConfig)).toBe(true);
      expect(isEnabled(disabledConfig)).toBe(false);
    });
  });

  describe("complex types", () => {
    it("should work with union types", () => {
      interface Card { type: "creature" | "instant" | "sorcery"; name: string }
      const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");
      const isInstant = createTypeGuard<Card, "type", "instant">("type", "instant");

      const creature: Card = { name: "Dragon", type: "creature" };
      const instant: Card = { name: "Lightning Bolt", type: "instant" };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(instant)).toBe(false);
      expect(isInstant(instant)).toBe(true);
      expect(isInstant(creature)).toBe(false);
    });

    it("should work with optional fields", () => {
      interface Card { type?: string; name: string }
      const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");

      const creature: Card = { name: "Dragon", type: "creature" };
      const noType: Card = { name: "Unknown" };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(noType)).toBe(false);
    });

    it("should work with nested objects", () => {
      interface Card {
        metadata: {
          category: string;
          version: number;
        };
        name: string;
      }
      const isStandard = createTypeGuard<Card, "metadata", { category: "standard"; version: 1 }>(
        "metadata",
        { category: "standard", version: 1 },
      );

      const standardCard: Card = {
        metadata: { category: "standard", version: 1 },
        name: "Card",
      };
      const modernCard: Card = {
        metadata: { category: "modern", version: 1 },
        name: "Card",
      };

      expect(isStandard(standardCard)).toBe(true);
      expect(isStandard(modernCard)).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should narrow types correctly in TypeScript", () => {
      interface Card {
        type: "creature" | "instant";
        name: string;
        power?: number;
      }
      const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");

      const card: Card = { name: "Dragon", power: 5, type: "creature" };

      if (isCreature(card)) {
        // TypeScript should know that card.type is "creature" here
        const typeValue: "creature" = card.type;
        expect(typeValue).toBe("creature");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle null and undefined gracefully", () => {
      interface Card { type: string | null | undefined; name: string }
      const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");

      const nullCard: Card = { name: "Card", type: null };
      const undefinedCard: Card = { name: "Card", type: undefined };
      const validCard: Card = { name: "Card", type: "creature" };

      expect(isCreature(nullCard)).toBe(false);
      expect(isCreature(undefinedCard)).toBe(false);
      expect(isCreature(validCard)).toBe(true);
    });

    it("should handle empty strings", () => {
      interface Card { type: string; name: string }
      const isEmpty = createTypeGuard<Card, "type", "">("type", "");

      const emptyCard: Card = { name: "Card", type: "" };
      const nonEmptyCard: Card = { name: "Card", type: "creature" };

      expect(isEmpty(emptyCard)).toBe(true);
      expect(isEmpty(nonEmptyCard)).toBe(false);
    });

    it("should handle objects without the specified field", () => {
      interface PartialCard { name: string; type?: string }
      const isCreature = createTypeGuard<PartialCard, "type", "creature">("type", "creature");

      const card: PartialCard = { name: "Card" };

      expect(isCreature(card)).toBe(false);
    });
  });

  describe("array values", () => {
    it("should create a type guard for array field values", () => {
      interface Card { types: string[]; name: string }
      const hasCreatureTypes = createTypeGuard<Card, "types", string[]>("types", [
        "creature",
        "dragon",
      ]);

      const dragonCard: Card = {
        name: "Dragon",
        types: ["creature", "dragon"],
      };
      const goblinCard: Card = {
        name: "Goblin",
        types: ["creature", "goblin"],
      };

      expect(hasCreatureTypes(dragonCard)).toBe(true);
      expect(hasCreatureTypes(goblinCard)).toBe(false);
    });
  });

  describe("performance", () => {
    it("should be efficient for multiple checks", () => {
      interface Card { type: string; name: string }
      const isCreature = createTypeGuard<Card, "type", "creature">("type", "creature");

      const creature: Card = { name: "Dragon", type: "creature" };
      const instant: Card = { name: "Lightning Bolt", type: "instant" };

      const startTime = performance.now();
      for (let i = 0; i < 10_000; i++) {
        isCreature(creature);
        isCreature(instant);
      }
      const endTime = performance.now();

      // Should complete in reasonable time (< 1000ms for 20k checks, higher threshold for CI parallel execution)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
