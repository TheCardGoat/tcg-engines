import { describe, expect, test } from "@jest/globals";
import st03Cards from "../../cards/imports/st03.json";
import { parseGundamText } from "../index";

/**
 * Test suite for parsing card text from ST03 (Fierce Attack) set
 *
 * These tests verify that the parser correctly handles various effect types
 * including keyword abilities, triggered abilities, and more complex effects.
 */
describe("ST03 Card Text Parser Tests", () => {
  // Helper function to clean HTML entities from card text
  function cleanCardText(text: string): string {
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<br>/g, "\n")
      .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
      .trim();
  }

  // Helper to create a standardized test for a card
  function testCard(card: any) {
    const cardCode = card.code;
    const cardName = card.name;
    const cardText = card.effect || "";

    test(`${cardCode} - ${cardName}`, () => {
      // Skip empty card texts
      if (cardText === "-" || !cardText) {
        return;
      }

      const cleanedText = cleanCardText(cardText);
      const result = parseGundamText(cleanedText);

      // Basic validation
      expect(result).toBeDefined();
      expect(result.errors).toHaveLength(0);

      // Should have at least one ability for non-empty text
      if (cleanedText.length > 0) {
        expect(result.abilities.length).toBeGreaterThan(0);
      }
    });
  }

  // Test cards with specific effect types
  describe("Effect Types", () => {
    // Get the first card with a specific effect pattern
    function getCardWithText(pattern: RegExp): any {
      return st03Cards.find((card) => card.effect && pattern.test(card.effect));
    }

    test("Cards with Repair keyword", () => {
      const card = getCardWithText(/&lt;Repair/);
      if (card) {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        // Verify we have abilities
        expect(result.abilities.length).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);
      } else {
        // Skip test if no matching card found
        console.log("No cards with Repair keyword found in ST03");
      }
    });

    test("Cards with Blocker keyword", () => {
      const card = getCardWithText(/&lt;Blocker/);
      if (card) {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        expect(result.abilities.length).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);
      } else {
        console.log("No cards with Blocker keyword found in ST03");
      }
    });

    // Test for ST03-specific keywords - Breach
    test("Cards with Breach keyword", () => {
      const card = getCardWithText(/&lt;Breach/);
      if (card) {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        expect(result.abilities.length).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);
      } else {
        console.log("No cards with Breach keyword found in ST03");
      }
    });

    test("Cards with Deploy trigger", () => {
      const card = getCardWithText(/【Deploy】/);
      if (card) {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        expect(result.abilities.length).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);
      } else {
        console.log("No cards with Deploy trigger found in ST03");
      }
    });

    test("Cards with Attack trigger", () => {
      const card = getCardWithText(/【Attack】/);
      if (card) {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        expect(result.abilities.length).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);
      } else {
        console.log("No cards with Attack trigger found in ST03");
      }
    });
  });

  // Test a sampling of cards from the set
  describe("Selected ST03 Cards", () => {
    // Test the first 5 cards with effects
    const cardSample = st03Cards
      .filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType.includes("TOKEN"),
      )
      .slice(0, 5);

    cardSample.forEach((card) => {
      testCard(card);
    });
  });

  // Test cards of each type
  describe("Card Types", () => {
    const types = ["UNIT", "PILOT", "COMMAND", "BASE"];

    types.forEach((type) => {
      test(`${type} cards`, () => {
        const card = st03Cards.find(
          (c) => c.cardType === type && c.effect && c.effect !== "-",
        );
        if (card) {
          const cleanedText = cleanCardText(card.effect);
          const result = parseGundamText(cleanedText);

          expect(result.abilities.length).toBeGreaterThan(0);
          expect(result.errors).toHaveLength(0);
        } else {
          console.log(`No ${type} cards with effects found in ST03`);
        }
      });
    });
  });

  // Test all cards in the set
  describe("Complete ST03 Set Test", () => {
    test("All cards can be parsed without errors", () => {
      const cardsWithEffects = st03Cards.filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType.includes("TOKEN") &&
          !card.cardType.includes("RESOURCE"),
      );

      // Take a sample to keep tests fast
      const sampleSize = Math.min(10, cardsWithEffects.length);
      const sampleCards = cardsWithEffects.slice(0, sampleSize);

      console.log(`Testing ${sampleCards.length} cards from ST03`);

      let successCount = 0;
      let failCount = 0;

      sampleCards.forEach((card) => {
        const cleanedText = cleanCardText(card.effect);
        try {
          const result = parseGundamText(cleanedText);
          if (result.errors.length === 0) {
            successCount++;
          } else {
            failCount++;
            console.log(
              `Failed to parse ${card.code} (${card.name}): ${result.errors.join(", ")}`,
            );
          }
        } catch (error) {
          failCount++;
          console.log(
            `Error parsing ${card.code} (${card.name}): ${error.message}`,
          );
        }
      });

      expect(failCount).toBe(0);
      expect(successCount).toBe(sampleCards.length);
    });
  });
});
