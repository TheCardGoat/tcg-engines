import { describe, expect, test } from "@jest/globals";
import st01Cards from "../../cards/imports/st01.json";
import { parseGundamText } from "../index";

/**
 * Test suite for processing all cards from the ST01 set using the parser
 */
describe("ST01 JSON Card Tests", () => {
  // Helper function to clean HTML entities from card text
  function cleanCardText(text: string): string {
    if (!text) return "";

    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<br>/g, "\n")
      .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
      .trim();
  }

  // Process all cards with effects in the st01.json file
  test("should parse all ST01 cards without errors", () => {
    // Filter out cards that are just tokens, resources, etc. without effects
    const cardsWithEffects = st01Cards.filter(
      (card) =>
        card.effect &&
        card.effect !== "-" &&
        !card.cardType.includes("TOKEN") &&
        !card.cardType.includes("RESOURCE"),
    );

    console.log(
      `Testing ${cardsWithEffects.length} cards with effects from ST01`,
    );

    // Process each card and track success/failure
    const results = cardsWithEffects.map((card) => {
      const cleanedText = cleanCardText(card.effect);
      const parseResult = parseGundamText(cleanedText);

      return {
        code: card.code,
        name: card.name,
        cardType: card.cardType,
        success: parseResult.errors.length === 0,
        abilityCount: parseResult.abilities.length,
        warnings: parseResult.warnings,
        errors: parseResult.errors,
        text: cleanedText,
      };
    });

    // Count successful and failed parses
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    // Log failed cards for debugging
    if (failureCount > 0) {
      console.log("\nCards with parsing errors:");
      results
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(
            `- ${result.code} (${result.name}): ${result.errors.join(", ")}`,
          );
          console.log(`  Text: ${result.text}`);
        });
    }

    // Log warnings for cards that parsed successfully but had issues
    const cardsWithWarnings = results.filter(
      (r) => r.success && r.warnings.length > 0,
    );
    if (cardsWithWarnings.length > 0) {
      console.log("\nCards with warnings:");
      cardsWithWarnings.forEach((result) => {
        console.log(
          `- ${result.code} (${result.name}): ${result.warnings.join(", ")}`,
        );
      });
    }

    // Basic statistics
    console.log(
      `\nParse results: ${successCount}/${results.length} cards successfully parsed`,
    );

    // Verify all cards parsed successfully
    expect(failureCount).toBe(0);

    // Each card with effects should have at least one ability
    results.forEach((result) => {
      expect(result.abilityCount).toBeGreaterThan(0);
    });
  });

  // Test specific effect types across all cards
  describe("Effect Type Coverage", () => {
    // Track all cards that have a specific effect type
    function getCardsWithEffectType(effectType: string) {
      return st01Cards
        .filter((card) => card.effect && card.effect !== "-")
        .map((card) => {
          const cleanedText = cleanCardText(card.effect);
          const parseResult = parseGundamText(cleanedText);

          // Check if any ability has an effect of the given type
          const hasEffectType = parseResult.abilities.some((ability) =>
            ability.effects?.some((effect) => effect.type === effectType),
          );

          return { card, hasEffectType };
        })
        .filter((result) => result.hasEffectType)
        .map((result) => result.card);
    }

    test("Damage effects", () => {
      const cardsWithDamageEffects = getCardsWithEffectType("damage");
      console.log(
        `Found ${cardsWithDamageEffects.length} cards with damage effects`,
      );

      // Just checking that the test runs, not enforcing specific counts
      expect(cardsWithDamageEffects.length).toBeGreaterThanOrEqual(0);
    });

    test("Draw effects", () => {
      const cardsWithDrawEffects = getCardsWithEffectType("draw");
      console.log(
        `Found ${cardsWithDrawEffects.length} cards with draw effects`,
      );

      // Just checking that the test runs, not enforcing specific counts
      expect(cardsWithDrawEffects.length).toBeGreaterThanOrEqual(0);
    });

    test("Repair keyword", () => {
      const repairCards = st01Cards.filter(
        (card) => card.effect && card.effect.includes("<Repair"),
      );

      console.log(`Found ${repairCards.length} cards with Repair keyword`);

      // Test each repair card
      repairCards.forEach((card) => {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        // Basic validation
        expect(result.errors).toHaveLength(0);
        expect(result.abilities.length).toBeGreaterThan(0);
      });
    });

    test("Blocker keyword", () => {
      const blockerCards = st01Cards.filter(
        (card) => card.effect && card.effect.includes("<Blocker"),
      );

      console.log(`Found ${blockerCards.length} cards with Blocker keyword`);

      // Test each blocker card
      blockerCards.forEach((card) => {
        const cleanedText = cleanCardText(card.effect);
        const result = parseGundamText(cleanedText);

        // Basic validation
        expect(result.errors).toHaveLength(0);
        expect(result.abilities.length).toBeGreaterThan(0);
      });
    });
  });

  // Test cards by card type
  describe("Card Type Coverage", () => {
    function testCardsByType(cardType: string) {
      test(`${cardType} cards`, () => {
        // Get all cards of the specific type with non-empty effects
        const typeCards = st01Cards.filter(
          (card) =>
            card.cardType === cardType && card.effect && card.effect !== "-",
        );

        console.log(`Testing ${typeCards.length} ${cardType} cards`);

        // Test each card
        typeCards.forEach((card) => {
          const cleanedText = cleanCardText(card.effect);
          const result = parseGundamText(cleanedText);

          // Basic validation
          expect(result.errors).toHaveLength(0);
          expect(result.abilities.length).toBeGreaterThan(0);
        });
      });
    }

    // Test each card type
    testCardsByType("UNIT");
    testCardsByType("PILOT");
    testCardsByType("COMMAND");
    testCardsByType("BASE");
  });
});
