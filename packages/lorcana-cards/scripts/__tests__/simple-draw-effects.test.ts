import { describe, expect, it } from "bun:test";
import { isParseableCard } from "../generators/parser-validator";
import type { CanonicalCard } from "../types";

// Helper to create a minimal test card
function createTestCard(overrides: Partial<CanonicalCard> = {}): CanonicalCard {
  return {
    id: "test-card",
    name: "Test Card",
    version: "1",
    fullName: "Test Card",
    inkType: "amber",
    cost: 1,
    inkable: true,
    vanilla: false,
    cardType: "action",
    rulesText: "",
    printings: [],
    ...overrides,
  } as CanonicalCard;
}

describe("Simple Draw Effects", () => {
  describe("isParseableCard", () => {
    describe("Start of Turn / Triggered", () => {
      it("should accept 'At the start of your turn, draw a card'", () => {
        const card = createTestCard({
          rulesText: "At the start of your turn, draw a card",
        });
        expect(isParseableCard(card)).toBe(true);
      });
    });

    describe("Allowed Simple Draw Patterns", () => {
      it("should accept 'Draw a card'", () => {
        const card = createTestCard({ rulesText: "Draw a card" });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'Draw 2 cards'", () => {
        const card = createTestCard({ rulesText: "Draw 2 cards" });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'Each player draws a card'", () => {
        const card = createTestCard({ rulesText: "Each player draws a card" });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'Chosen player draws 2 cards'", () => {
        const card = createTestCard({
          rulesText: "Chosen player draws 2 cards",
        });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'When you play this character, draw a card'", () => {
        const card = createTestCard({
          rulesText: "When you play this character, draw a card",
        });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'Whenever this character quests, draw a card'", () => {
        const card = createTestCard({
          rulesText: "Whenever this character quests, draw a card",
        });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards'", () => {
        // This is a conditional trigger, but the effect is simple draw.
        const card = createTestCard({
          rulesText:
            "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards",
        });
        expect(isParseableCard(card)).toBe(true);
      });
    });

    describe("Allowed Wrapper Patterns", () => {
      it("should accept 'You may draw a card'", () => {
        const card = createTestCard({ rulesText: "You may draw a card" });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'If X, draw a card'", () => {
        // Conditional effect
        const card = createTestCard({
          rulesText:
            "SHOW ME {E} - If you have no cards in your hand, draw a card",
        });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'Draw a card for each character'", () => {
        const card = createTestCard({
          rulesText: "Draw a card for each character you have",
        });
        expect(isParseableCard(card)).toBe(true);
      });

      it("should accept 'Draw a card. Repeat this 3 times'", () => {
        const card = createTestCard({
          rulesText: "Draw a card. Repeat this 3 times",
        });
        expect(isParseableCard(card)).toBe(true);
      });
    });

    describe("Rejected Composite Draw Patterns", () => {
      it("should reject 'Draw a card, then discard'", () => {
        const card = createTestCard({ rulesText: "Draw a card, then discard" });
        expect(isParseableCard(card)).toBe(false);
      });

      it("should reject 'Draw 2 cards, then deal 1 damage'", () => {
        const card = createTestCard({
          rulesText: "Draw 2 cards, then deal 1 damage",
        });
        expect(isParseableCard(card)).toBe(false);
      });

      it("should reject 'Choose one: Draw a card or discard'", () => {
        const card = createTestCard({
          rulesText: "Choose one: Draw a card or discard",
        });
        expect(isParseableCard(card)).toBe(false);
      });
    });

    describe("Action Costs vs Effects", () => {
      it("should accept action with cost if effect is simple draw: 'I SUMMON THEE {E} - Draw a card'", () => {
        // Assuming parser separates cost and effect correctly
        const card = createTestCard({
          rulesText: "I SUMMON THEE {E} - Draw a card",
        });
        expect(isParseableCard(card)).toBe(true);
      });
    });
  });
});
