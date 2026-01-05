import { describe, expect, it } from "bun:test";
import type { CardDefinition } from "../cards/card-definition";
import { isCardOfType } from "./card-type-guards";

describe("isCardOfType", () => {
  describe("basic usage", () => {
    it("should create a type guard for card type", () => {
      const isCreature = isCardOfType("creature");

      const creature: CardDefinition = {
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
        basePower: 5,
        baseToughness: 5,
      };

      const instant: CardDefinition = {
        id: "bolt-1",
        name: "Lightning Bolt",
        type: "instant",
      };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(instant)).toBe(false);
    });

    it("should work with multiple card types", () => {
      const isCreature = isCardOfType("creature");
      const isInstant = isCardOfType("instant");
      const isSorcery = isCardOfType("sorcery");

      const creature: CardDefinition = {
        id: "creature-1",
        name: "Creature",
        type: "creature",
      };

      const instant: CardDefinition = {
        id: "instant-1",
        name: "Instant",
        type: "instant",
      };

      const sorcery: CardDefinition = {
        id: "sorcery-1",
        name: "Sorcery",
        type: "sorcery",
      };

      expect(isCreature(creature)).toBe(true);
      expect(isCreature(instant)).toBe(false);
      expect(isCreature(sorcery)).toBe(false);

      expect(isInstant(instant)).toBe(true);
      expect(isInstant(creature)).toBe(false);
      expect(isInstant(sorcery)).toBe(false);

      expect(isSorcery(sorcery)).toBe(true);
      expect(isSorcery(creature)).toBe(false);
      expect(isSorcery(instant)).toBe(false);
    });
  });

  describe("filtering arrays", () => {
    it("should filter card arrays by type", () => {
      const cards: CardDefinition[] = [
        { id: "1", name: "Dragon", type: "creature" },
        { id: "2", name: "Bolt", type: "instant" },
        { id: "3", name: "Goblin", type: "creature" },
        { id: "4", name: "Wrath", type: "sorcery" },
        { id: "5", name: "Angel", type: "creature" },
      ];

      const isCreature = isCardOfType("creature");
      const creatures = cards.filter(isCreature);

      expect(creatures).toHaveLength(3);
      expect(creatures.map((c) => c.name)).toEqual([
        "Dragon",
        "Goblin",
        "Angel",
      ]);
    });

    it("should work with Array.some and Array.every", () => {
      const cards: CardDefinition[] = [
        { id: "1", name: "Dragon", type: "creature" },
        { id: "2", name: "Goblin", type: "creature" },
      ];

      const allCreatures: CardDefinition[] = [
        { id: "3", name: "Angel", type: "creature" },
      ];

      const isCreature = isCardOfType("creature");

      expect(cards.some(isCreature)).toBe(true);
      expect(cards.every(isCreature)).toBe(true);
      expect(allCreatures.every(isCreature)).toBe(true);
    });
  });

  describe("type narrowing", () => {
    it("should narrow types in conditional blocks", () => {
      const card: CardDefinition = {
        id: "dragon-1",
        name: "Dragon",
        type: "creature",
        basePower: 5,
        baseToughness: 5,
      };

      const isCreature = isCardOfType("creature");

      if (isCreature(card)) {
        // TypeScript should know card.type is "creature"
        expect(card.type).toBe("creature");
        expect(card.name).toBe("Dragon");
      }
    });
  });

  describe("game-specific types", () => {
    it("should work with Gundam-specific card types", () => {
      type GundamCard = CardDefinition & {
        type: "unit" | "command" | "character" | "base";
      };

      const isUnit = isCardOfType<GundamCard>("unit");
      const isCommand = isCardOfType<GundamCard>("command");

      const unit: GundamCard = {
        id: "gundam-1",
        name: "RX-78-2 Gundam",
        type: "unit",
        basePower: 3,
      };

      const command: GundamCard = {
        id: "command-1",
        name: "All-Out Attack",
        type: "command",
      };

      expect(isUnit(unit)).toBe(true);
      expect(isUnit(command)).toBe(false);
      expect(isCommand(command)).toBe(true);
      expect(isCommand(unit)).toBe(false);
    });

    it("should work with Lorcana-specific card types", () => {
      type LorcanaCard = CardDefinition & {
        type: "character" | "action" | "item" | "location";
      };

      const isCharacter = isCardOfType<LorcanaCard>("character");
      const isAction = isCardOfType<LorcanaCard>("action");

      const character: LorcanaCard = {
        id: "mickey-1",
        name: "Mickey Mouse - Brave Little Tailor",
        type: "character",
        basePower: 4,
      };

      const action: LorcanaCard = {
        id: "action-1",
        name: "Be Prepared",
        type: "action",
      };

      expect(isCharacter(character)).toBe(true);
      expect(isCharacter(action)).toBe(false);
      expect(isAction(action)).toBe(true);
      expect(isAction(character)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle cards with missing type field", () => {
      const isCreature = isCardOfType("creature");
      const cardWithoutType = { id: "1", name: "Card" } as CardDefinition;

      expect(isCreature(cardWithoutType)).toBe(false);
    });

    it("should handle empty strings", () => {
      const isEmpty = isCardOfType("");
      const emptyCard: CardDefinition = {
        id: "1",
        name: "Card",
        type: "",
      };
      const normalCard: CardDefinition = {
        id: "2",
        name: "Card",
        type: "creature",
      };

      expect(isEmpty(emptyCard)).toBe(true);
      expect(isEmpty(normalCard)).toBe(false);
    });

    it("should be case-sensitive", () => {
      const isCreature = isCardOfType("creature");
      const uppercaseCard: CardDefinition = {
        id: "1",
        name: "Card",
        type: "Creature", // uppercase C
      };
      const lowercaseCard: CardDefinition = {
        id: "2",
        name: "Card",
        type: "creature",
      };

      expect(isCreature(uppercaseCard)).toBe(false);
      expect(isCreature(lowercaseCard)).toBe(true);
    });
  });

  describe("performance", () => {
    it("should be efficient for large arrays", () => {
      const cards: CardDefinition[] = Array.from({ length: 10000 }, (_, i) => ({
        id: `card-${i}`,
        name: `Card ${i}`,
        type: i % 3 === 0 ? "creature" : i % 3 === 1 ? "instant" : "sorcery",
      }));

      const isCreature = isCardOfType("creature");

      const startTime = performance.now();
      const creatures = cards.filter(isCreature);
      const endTime = performance.now();

      expect(creatures.length).toBeGreaterThan(0);
      // Should complete in reasonable time (< 1000ms for 10k cards, higher threshold for CI parallel execution)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
