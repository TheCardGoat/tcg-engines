import { describe, expect, test } from "@jest/globals";
import gd01Cards from "../../cards/imports/gd01.json";
import { parseGundamText } from "../index";

// Define a type for card objects to fix type errors
interface GundamCard {
  id: string;
  code: string;
  rarity: string;
  name: string;
  images: { small: string; large: string };
  level?: string;
  cost?: string;
  color?: string;
  cardType: string;
  effect?: string;
  zone?: string;
  trait?: string;
  link?: string;
  ap?: string;
  hp?: string;
  sourceTitle?: string;
  getIt?: string;
  set?: { id: string; name: string };
}

/**
 * Test suite for parsing card text from GD01 (first major expansion) set
 *
 * These tests verify that the parser correctly handles various effect types
 * in what is likely one of the more complex sets with innovative mechanics.
 */
describe("GD01 Card Text Parser Tests", () => {
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
  function testCard(card: GundamCard) {
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

  // Sample test for specific cards
  describe("Sample GD01 Cards", () => {
    // Get the first 10 cards with effects
    const sampleCards = (gd01Cards as GundamCard[])
      .filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType.includes("TOKEN") &&
          !card.cardType.includes("RESOURCE"),
      )
      .slice(0, 10);

    console.log(`Testing ${sampleCards.length} sample cards from GD01`);

    sampleCards.forEach((card) => {
      testCard(card);
    });
  });

  // Test cards with specific effect types
  describe("Effect Types", () => {
    // Get cards with specific effect patterns
    function getCardsWithText(pattern: RegExp, limit = 1): GundamCard[] {
      const matches = (gd01Cards as GundamCard[]).filter(
        (card) => card.effect && pattern.test(card.effect),
      );
      return matches.slice(0, limit);
    }

    // Test keywords that might appear in GD01
    const keywords = [
      "Repair",
      "Blocker",
      "Breach",
      "Support",
      "Rush",
      "Pierce",
      "Intercept",
      "Stealth",
    ];

    keywords.forEach((keyword) => {
      test(`Cards with ${keyword} keyword`, () => {
        const cards = getCardsWithText(new RegExp(`&lt;${keyword}`));

        console.log(
          `Found ${cards.length > 0 ? cards.length : "no"} GD01 cards with ${keyword}`,
        );

        cards.forEach((card) => {
          if (card) {
            const cleanedText = cleanCardText(card.effect || "");
            const result = parseGundamText(cleanedText);

            expect(result.abilities.length).toBeGreaterThan(0);
            expect(result.errors).toHaveLength(0);
          }
        });
      });
    });

    // Test common trigger types
    const triggers = [
      "Deploy",
      "Attack",
      "Burst",
      "When Paired",
      "When Destroyed",
      "During Your Turn",
      "During Enemy's Turn",
    ];

    triggers.forEach((trigger) => {
      test(`Cards with ${trigger} trigger`, () => {
        // Convert the trigger name to the Japanese-style brackets format
        const pattern = new RegExp(`【${trigger}】`);
        const cards = getCardsWithText(pattern);

        console.log(
          `Found ${cards.length > 0 ? cards.length : "no"} GD01 cards with ${trigger} trigger`,
        );

        cards.forEach((card) => {
          if (card) {
            const cleanedText = cleanCardText(card.effect || "");
            const result = parseGundamText(cleanedText);

            expect(result.abilities.length).toBeGreaterThan(0);
            expect(result.errors).toHaveLength(0);
          }
        });
      });
    });
  });

  // Test by card type
  describe("Card Type Tests", () => {
    const cardTypes = ["UNIT", "PILOT", "COMMAND", "BASE"];

    cardTypes.forEach((type) => {
      test(`${type} cards`, () => {
        // Get a sample of this card type
        const cards = (gd01Cards as GundamCard[])
          .filter((c) => c.cardType === type && c.effect && c.effect !== "-")
          .slice(0, 2); // Test up to 2 cards of each type

        console.log(`Testing ${cards.length} ${type} cards from GD01`);

        cards.forEach((card) => {
          const cleanedText = cleanCardText(card.effect || "");
          const result = parseGundamText(cleanedText);

          expect(result.abilities.length).toBeGreaterThan(0);
          expect(result.errors).toHaveLength(0);
        });
      });
    });
  });

  // Test for complex cards - find cards with longer text
  describe("Complex Card Tests", () => {
    test("Complex cards with multiple effects", () => {
      // Find cards with longer effect text
      const complexCards = (gd01Cards as GundamCard[])
        .filter((card) => card.effect && card.effect.length > 150)
        .slice(0, 3); // Test up to 3 complex cards

      console.log(`Testing ${complexCards.length} complex cards from GD01`);

      complexCards.forEach((card) => {
        const cleanedText = cleanCardText(card.effect || "");
        const result = parseGundamText(cleanedText);

        expect(result.abilities.length).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);

        // Complex cards often have multiple abilities
        if (
          cleanedText.split("\n").filter((line) => line.trim().length > 0)
            .length > 1
        ) {
          // This is a very loose expectation as not all line breaks mean separate abilities
          console.log(
            `${card.code} (${card.name}) has ${result.abilities.length} abilities`,
          );
        }
      });
    });
  });

  // Randomized test to improve coverage
  describe("Random Card Test", () => {
    test("Random selection of GD01 cards", () => {
      const cardsWithEffects = (gd01Cards as GundamCard[]).filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType.includes("TOKEN") &&
          !card.cardType.includes("RESOURCE"),
      );

      // Get 5 random cards from the set
      const randomCards: GundamCard[] = [];
      for (let i = 0; i < Math.min(5, cardsWithEffects.length); i++) {
        const randomIndex = Math.floor(Math.random() * cardsWithEffects.length);
        randomCards.push(cardsWithEffects[randomIndex]);
        // Remove the card to avoid duplicates
        cardsWithEffects.splice(randomIndex, 1);
      }

      console.log(`Testing ${randomCards.length} randomly selected GD01 cards`);

      let successCount = 0;
      let failCount = 0;

      randomCards.forEach((card) => {
        const cleanedText = cleanCardText(card.effect || "");
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
      expect(successCount).toBe(randomCards.length);
    });
  });
});
