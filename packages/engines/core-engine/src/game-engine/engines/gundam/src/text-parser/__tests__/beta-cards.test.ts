import { describe, expect, test } from "@jest/globals";
import betaCards from "../../cards/imports/beta.json";
import { parseGundamText } from "../index";

/**
 * Test suite for parsing card text from Beta cards
 *
 * These tests verify that the parser correctly handles beta card texts,
 * which might contain experimental or in-development effects.
 */
describe("Beta Card Text Parser Tests", () => {
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

  // Test a sample of beta cards
  describe("Sample Beta Cards", () => {
    // Get a sample of cards with effects
    const sampleSize = 10;
    const sampleCards = betaCards
      .filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType?.includes("TOKEN") &&
          !card.cardType?.includes("RESOURCE"),
      )
      .slice(0, sampleSize);

    console.log(`Testing ${sampleCards.length} sample beta cards`);

    sampleCards.forEach((card) => {
      testCard(card);
    });
  });

  // Test cards with keywords
  describe("Keyword Effects", () => {
    // Test for common keywords
    const keywordPatterns = [
      { name: "Repair", pattern: /&lt;Repair/ },
      { name: "Blocker", pattern: /&lt;Blocker/ },
      { name: "Breach", pattern: /&lt;Breach/ },
      { name: "Support", pattern: /&lt;Support/ },
      { name: "Rush", pattern: /&lt;Rush/ },
    ];

    keywordPatterns.forEach(({ name, pattern }) => {
      test(`Cards with ${name} keyword`, () => {
        // Find cards with this keyword
        const matchingCards = betaCards
          .filter((card) => card.effect && pattern.test(card.effect))
          .slice(0, 1); // Test one card per keyword

        console.log(
          `Found ${matchingCards.length} beta cards with ${name} keyword`,
        );

        matchingCards.forEach((card) => {
          const cleanedText = cleanCardText(card.effect);
          const result = parseGundamText(cleanedText);

          expect(result.abilities.length).toBeGreaterThan(0);
          expect(result.errors).toHaveLength(0);
        });
      });
    });
  });

  // Test cards with timing triggers
  describe("Timing Triggers", () => {
    // Test for common triggers
    const triggerPatterns = [
      { name: "Deploy", pattern: /【Deploy】/ },
      { name: "Attack", pattern: /【Attack】/ },
      { name: "When Paired", pattern: /【When Paired】/ },
      { name: "Burst", pattern: /【Burst】/ },
      { name: "Main", pattern: /【Main】/ },
    ];

    triggerPatterns.forEach(({ name, pattern }) => {
      test(`Cards with ${name} trigger`, () => {
        // Find cards with this trigger
        const matchingCards = betaCards
          .filter((card) => card.effect && pattern.test(card.effect))
          .slice(0, 1); // Test one card per trigger

        console.log(
          `Found ${matchingCards.length} beta cards with ${name} trigger`,
        );

        matchingCards.forEach((card) => {
          const cleanedText = cleanCardText(card.effect);
          const result = parseGundamText(cleanedText);

          expect(result.abilities.length).toBeGreaterThan(0);
          expect(result.errors).toHaveLength(0);
        });
      });
    });
  });

  // Test cards by type
  describe("Card Types", () => {
    // Get unique card types
    const cardTypes = [
      ...new Set(
        betaCards.filter((card) => card.cardType).map((card) => card.cardType),
      ),
    ];

    // Test each card type
    cardTypes.forEach((type) => {
      if (!type) return; // Skip empty types

      test(`${type} cards`, () => {
        // Get cards of this type with effects
        const cards = betaCards
          .filter(
            (card) =>
              card.cardType === type && card.effect && card.effect !== "-",
          )
          .slice(0, 1); // Test one card per type

        if (cards.length === 0) {
          console.log(`No ${type} beta cards with effects found`);
          return;
        }

        console.log(`Testing ${cards.length} ${type} beta cards`);

        cards.forEach((card) => {
          const cleanedText = cleanCardText(card.effect);
          const result = parseGundamText(cleanedText);

          expect(result.abilities.length).toBeGreaterThan(0);
          expect(result.errors).toHaveLength(0);
        });
      });
    });
  });

  // Error handling test - ensure all beta cards can be parsed
  describe("Error Handling", () => {
    test("Sample of all beta cards parse without errors", () => {
      // Get a sample of all cards with effects
      const cardsWithEffects = betaCards.filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType?.includes("TOKEN") &&
          !card.cardType?.includes("RESOURCE"),
      );

      // Use a smaller sample for performance
      const sampleSize = Math.min(20, cardsWithEffects.length);
      const sampleCards = cardsWithEffects.slice(0, sampleSize);

      console.log(`Error checking ${sampleCards.length} beta cards`);

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

      console.log(
        `Successfully parsed ${successCount}/${sampleCards.length} beta cards`,
      );

      expect(failCount).toBe(0);
      expect(successCount).toBe(sampleCards.length);
    });
  });
});
