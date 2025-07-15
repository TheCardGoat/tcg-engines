import { describe, expect, test } from "@jest/globals";
import promotionCards from "../../cards/imports/promotion.json";
import { parseGundamText } from "../index";

/**
 * Test suite for parsing card text from Promotion cards
 *
 * These tests verify that the parser correctly handles various effect types
 * for promotional cards that may have unique or experimental effects.
 */
describe("Promotion Card Text Parser Tests", () => {
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

  // Test all promotion cards with effects
  describe("All Promotion Cards", () => {
    const cardsWithEffects = promotionCards.filter(
      (card) =>
        card.effect &&
        card.effect !== "-" &&
        !card.cardType.includes("TOKEN") &&
        !card.cardType.includes("RESOURCE"),
    );

    // If there are a lot of cards, limit to a reasonable sample
    const testCards =
      cardsWithEffects.length > 10
        ? cardsWithEffects.slice(0, 10)
        : cardsWithEffects;

    console.log(`Testing ${testCards.length} promotional cards`);

    testCards.forEach((card) => {
      testCard(card);
    });
  });

  // Test cards with specific effect types
  describe("Effect Types", () => {
    // Get all cards with a specific effect pattern
    function getCardsWithText(pattern: RegExp): any[] {
      return promotionCards.filter(
        (card) => card.effect && pattern.test(card.effect),
      );
    }

    // Test common keywords
    const keywordTests = [
      { name: "Repair", pattern: /&lt;Repair/ },
      { name: "Blocker", pattern: /&lt;Blocker/ },
      { name: "Breach", pattern: /&lt;Breach/ },
      { name: "Support", pattern: /&lt;Support/ },
      { name: "Rush", pattern: /&lt;Rush/ },
    ];

    keywordTests.forEach((keywordTest) => {
      test(`Cards with ${keywordTest.name} keyword`, () => {
        const cards = getCardsWithText(keywordTest.pattern);

        console.log(
          `Found ${cards.length} promotional cards with ${keywordTest.name}`,
        );

        cards.slice(0, 1).forEach((card) => {
          if (card) {
            const cleanedText = cleanCardText(card.effect);
            const result = parseGundamText(cleanedText);

            expect(result.abilities.length).toBeGreaterThan(0);
            expect(result.errors).toHaveLength(0);
          }
        });
      });
    });

    // Test common timing triggers
    const triggerTests = [
      { name: "Deploy", pattern: /【Deploy】/ },
      { name: "When Paired", pattern: /【When Paired】/ },
      { name: "Burst", pattern: /【Burst】/ },
      { name: "Attack", pattern: /【Attack】/ },
      { name: "Main", pattern: /【Main】/ },
    ];

    triggerTests.forEach((triggerTest) => {
      test(`Cards with ${triggerTest.name} trigger`, () => {
        const cards = getCardsWithText(triggerTest.pattern);

        console.log(
          `Found ${cards.length} promotional cards with ${triggerTest.name} trigger`,
        );

        cards.slice(0, 1).forEach((card) => {
          if (card) {
            const cleanedText = cleanCardText(card.effect);
            const result = parseGundamText(cleanedText);

            expect(result.abilities.length).toBeGreaterThan(0);
            expect(result.errors).toHaveLength(0);
          }
        });
      });
    });
  });

  // Test all card types found in promotional cards
  describe("Card Types", () => {
    // Get all unique card types
    const cardTypes = [...new Set(promotionCards.map((card) => card.cardType))];

    cardTypes.forEach((type) => {
      if (!type) return; // Skip undefined types

      test(`${type} cards`, () => {
        // Find the first card of this type with an effect
        const card = promotionCards.find(
          (c) => c.cardType === type && c.effect && c.effect !== "-",
        );

        if (card) {
          const cleanedText = cleanCardText(card.effect);
          const result = parseGundamText(cleanedText);

          expect(result.abilities.length).toBeGreaterThan(0);
          expect(result.errors).toHaveLength(0);
        } else {
          console.log(`No ${type} promotion cards with effects found`);
        }
      });
    });
  });

  // Test for parsing errors across all promotional cards
  describe("Error Check", () => {
    test("All promotional cards can be parsed without errors", () => {
      const cardsWithEffects = promotionCards.filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType.includes("TOKEN") &&
          !card.cardType.includes("RESOURCE"),
      );

      console.log(
        `Checking ${cardsWithEffects.length} promotional cards for parsing errors`,
      );

      let successCount = 0;
      let failCount = 0;

      cardsWithEffects.forEach((card) => {
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

      console.log(
        `Parsed ${successCount}/${cardsWithEffects.length} promotional cards successfully`,
      );

      expect(failCount).toBe(0);
      expect(successCount).toBe(cardsWithEffects.length);
    });
  });
});
