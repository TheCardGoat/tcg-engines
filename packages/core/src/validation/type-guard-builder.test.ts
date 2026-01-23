import { describe, expect, it } from "bun:test";
import { createTypeGuard } from "./type-guard-builder";

describe("createTypeGuard", () => {
  describe("basic type guards", () => {
    it("should create a type guard for a string field", () => {
      type Card = { type: string; name: string };
      const isCreature = createTypeGuard<Card, "type", "creature">(
        "type",
        "creature",
      );

      const creature: Card = { type: "creature", name: "Dragon" };
      const instant: Card = { type: "instant", name: "Lightning Bolt" };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(instant)).toBe(false);
    });

    it("should create a type guard for a number field", () => {
      type Item = { id: number; category: string };
      const isItem42 = createTypeGuard<Item, "id", 42>("id", 42);

      const item42: Item = { id: 42, category: "test" };
      const item10: Item = { id: 10, category: "test" };

      expect(isItem42(item42)).toBe(true);
      expect(isItem42(item10)).toBe(false);
    });

    it("should create a type guard for a boolean field", () => {
      type Config = { enabled: boolean; name: string };
      const isEnabled = createTypeGuard<Config, "enabled", true>(
        "enabled",
        true,
      );

      const enabledConfig: Config = { enabled: true, name: "test" };
      const disabledConfig: Config = { enabled: false, name: "test" };

      expect(isEnabled(enabledConfig)).toBe(true);
      expect(isEnabled(disabledConfig)).toBe(false);
    });
  });

  describe("complex types", () => {
    it("should work with union types", () => {
      type Card = { type: "creature" | "instant" | "sorcery"; name: string };
      const isCreature = createTypeGuard<Card, "type", "creature">(
        "type",
        "creature",
      );
      const isInstant = createTypeGuard<Card, "type", "instant">(
        "type",
        "instant",
      );

      const creature: Card = { type: "creature", name: "Dragon" };
      const instant: Card = { type: "instant", name: "Lightning Bolt" };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(instant)).toBe(false);
      expect(isInstant(instant)).toBe(true);
      expect(isInstant(creature)).toBe(false);
    });

    it("should work with optional fields", () => {
      type Card = { type?: string; name: string };
      const isCreature = createTypeGuard<Card, "type", "creature">(
        "type",
        "creature",
      );

      const creature: Card = { type: "creature", name: "Dragon" };
      const noType: Card = { name: "Unknown" };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(noType)).toBe(false);
    });

    it("should work with nested objects", () => {
      type Card = {
        metadata: {
          category: string;
          version: number;
        };
        name: string;
      };
      const isStandard = createTypeGuard<
        Card,
        "metadata",
        { category: "standard"; version: 1 }
      >("metadata", { category: "standard", version: 1 });

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
      type Card = {
        type: "creature" | "instant";
        name: string;
        power?: number;
      };
      const isCreature = createTypeGuard<Card, "type", "creature">(
        "type",
        "creature",
      );

      const card: Card = { type: "creature", name: "Dragon", power: 5 };

      if (isCreature(card)) {
        // TypeScript should know that card.type is "creature" here
        const typeValue: "creature" = card.type;
        expect(typeValue).toBe("creature");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle null and undefined gracefully", () => {
      type Card = { type: string | null | undefined; name: string };
      const isCreature = createTypeGuard<Card, "type", "creature">(
        "type",
        "creature",
      );

      const nullCard: Card = { type: null, name: "Card" };
      const undefinedCard: Card = { type: undefined, name: "Card" };
      const validCard: Card = { type: "creature", name: "Card" };

      expect(isCreature(nullCard)).toBe(false);
      expect(isCreature(undefinedCard)).toBe(false);
      expect(isCreature(validCard)).toBe(true);
    });

    it("should handle empty strings", () => {
      type Card = { type: string; name: string };
      const isEmpty = createTypeGuard<Card, "type", "">("type", "");

      const emptyCard: Card = { type: "", name: "Card" };
      const nonEmptyCard: Card = { type: "creature", name: "Card" };

      expect(isEmpty(emptyCard)).toBe(true);
      expect(isEmpty(nonEmptyCard)).toBe(false);
    });

    it("should handle objects without the specified field", () => {
      type PartialCard = { name: string; type?: string };
      const isCreature = createTypeGuard<PartialCard, "type", "creature">(
        "type",
        "creature",
      );

      const card: PartialCard = { name: "Card" };

      expect(isCreature(card)).toBe(false);
    });
  });

  describe("array values", () => {
    it("should create a type guard for array field values", () => {
      type Card = { types: string[]; name: string };
      const hasCreatureTypes = createTypeGuard<Card, "types", string[]>(
        "types",
        ["creature", "dragon"],
      );

      const dragonCard: Card = {
        types: ["creature", "dragon"],
        name: "Dragon",
      };
      const goblinCard: Card = {
        types: ["creature", "goblin"],
        name: "Goblin",
      };

      expect(hasCreatureTypes(dragonCard)).toBe(true);
      expect(hasCreatureTypes(goblinCard)).toBe(false);
    });
  });

  describe("performance", () => {
    it("should be efficient for multiple checks", () => {
      type Card = { type: string; name: string };
      const isCreature = createTypeGuard<Card, "type", "creature">(
        "type",
        "creature",
      );

      const creature: Card = { type: "creature", name: "Dragon" };
      const instant: Card = { type: "instant", name: "Lightning Bolt" };

      const startTime = performance.now();
      for (let i = 0; i < 10000; i++) {
        isCreature(creature);
        isCreature(instant);
      }
      const endTime = performance.now();

      // Should complete in reasonable time (< 1000ms for 20k checks, higher threshold for CI parallel execution)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
