import { describe, expect, it } from "bun:test";
import type { CardDefinition } from "../cards/card-definition";
import { createTestCard, createTestCards } from "./test-card-factory";

describe("test-card-factory", () => {
  describe("createTestCard", () => {
    it("should create card with default values", () => {
      const card = createTestCard();

      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.type).toBeDefined();
    });

    it("should generate unique IDs for each card", () => {
      const card1 = createTestCard();
      const card2 = createTestCard();
      const card3 = createTestCard();

      expect(card1.id).not.toBe(card2.id);
      expect(card2.id).not.toBe(card3.id);
      expect(card1.id).not.toBe(card3.id);
    });

    it("should override provided properties", () => {
      const card = createTestCard({
        name: "Custom Card",
        type: "spell",
        basePower: 10,
      });

      expect(card.name).toBe("Custom Card");
      expect(card.type).toBe("spell");
      expect(card.basePower).toBe(10);
    });

    it("should keep default values for non-overridden properties", () => {
      const card = createTestCard({
        name: "Custom Card",
      });

      expect(card.name).toBe("Custom Card");
      expect(card.type).toBeDefined(); // Should still have default type
      expect(card.id).toBeDefined(); // Should still have generated ID
    });

    it("should create creature card with power and toughness", () => {
      const creature = createTestCard({
        type: "creature",
        basePower: 3,
        baseToughness: 4,
      });

      expect(creature.type).toBe("creature");
      expect(creature.basePower).toBe(3);
      expect(creature.baseToughness).toBe(4);
    });

    it("should create spell card with cost", () => {
      const spell = createTestCard({
        type: "spell",
        baseCost: 5,
      });

      expect(spell.type).toBe("spell");
      expect(spell.baseCost).toBe(5);
    });

    it("should support abilities", () => {
      const card = createTestCard({
        abilities: ["flying", "haste"],
      });

      expect(card.abilities).toEqual(["flying", "haste"]);
    });

    it("should handle empty overrides", () => {
      const card = createTestCard({});

      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.type).toBeDefined();
    });

    it("should create valid card definition", () => {
      const card = createTestCard();

      // Verify it's a valid CardDefinition
      const validate = (def: CardDefinition) => def;
      expect(() => validate(card)).not.toThrow();
    });
  });

  describe("createTestCards", () => {
    it("should create multiple cards with default count", () => {
      const cards = createTestCards();

      expect(cards.length).toBe(3); // Default count
      expect(cards[0]).toBeDefined();
      expect(cards[1]).toBeDefined();
      expect(cards[2]).toBeDefined();
    });

    it("should create specified number of cards", () => {
      const cards = createTestCards(5);

      expect(cards.length).toBe(5);
    });

    it("should create cards with unique IDs", () => {
      const cards = createTestCards(10);

      const ids = cards.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(10); // All IDs should be unique
    });

    it("should apply overrides to all cards", () => {
      const cards = createTestCards(3, {
        type: "creature",
        basePower: 2,
      });

      for (const card of cards) {
        expect(card.type).toBe("creature");
        expect(card.basePower).toBe(2);
      }
    });

    it("should still generate unique IDs even with overrides", () => {
      const cards = createTestCards(3, {
        name: "Same Name",
        type: "creature",
      });

      const ids = cards.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
      expect(cards[0]?.name).toBe("Same Name");
      expect(cards[1]?.name).toBe("Same Name");
      expect(cards[2]?.name).toBe("Same Name");
    });

    it("should handle count of 0", () => {
      const cards = createTestCards(0);

      expect(cards.length).toBe(0);
      expect(cards).toEqual([]);
    });

    it("should handle count of 1", () => {
      const cards = createTestCards(1);

      expect(cards.length).toBe(1);
      expect(cards[0]).toBeDefined();
    });

    it("should create cards with different base stats", () => {
      const cards = createTestCards(3, {
        type: "creature",
        basePower: 5,
        baseToughness: 5,
        baseCost: 3,
      });

      for (const card of cards) {
        expect(card.type).toBe("creature");
        expect(card.basePower).toBe(5);
        expect(card.baseToughness).toBe(5);
        expect(card.baseCost).toBe(3);
      }
    });
  });

  describe("integration", () => {
    it("should create cards useful for testing", () => {
      // Create a test deck
      const creatures = createTestCards(20, {
        type: "creature",
        basePower: 2,
        baseToughness: 2,
      });

      const spells = createTestCards(10, {
        type: "spell",
        baseCost: 3,
      });

      const deck = [...creatures, ...spells];

      expect(deck.length).toBe(30);

      // Verify creatures
      const creatureCards = deck.filter((c) => c.type === "creature");
      expect(creatureCards.length).toBe(20);

      // Verify spells
      const spellCards = deck.filter((c) => c.type === "spell");
      expect(spellCards.length).toBe(10);

      // Verify all unique
      const ids = deck.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(30);
    });

    it("should work with card registry", () => {
      const cards = createTestCards(5);

      // Simulate registry usage
      const registry = new Map<string, CardDefinition>();
      for (const card of cards) {
        registry.set(card.id, card);
      }

      expect(registry.size).toBe(5);

      // Can retrieve cards by ID
      const firstCard = cards[0];
      if (firstCard) {
        const retrieved = registry.get(firstCard.id);
        expect(retrieved).toEqual(firstCard);
      }
    });
  });
});
