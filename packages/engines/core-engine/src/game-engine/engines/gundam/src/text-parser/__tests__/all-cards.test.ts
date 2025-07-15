import { describe, expect, test } from "@jest/globals";
import betaCards from "../../cards/imports/beta.json";
import gd01Cards from "../../cards/imports/gd01.json";
import promotionCards from "../../cards/imports/promotion.json";
import st01Cards from "../../cards/imports/st01.json";
import st02Cards from "../../cards/imports/st02.json";
import st03Cards from "../../cards/imports/st03.json";
import st04Cards from "../../cards/imports/st04.json";
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
 * Comprehensive test suite for the Gundam text parser
 *
 * This suite tests the parser against cards from all available JSON files
 * to ensure cross-set compatibility and consistent parsing behavior.
 */
describe("All Card Sets Text Parser Tests", () => {
  // Helper function to clean HTML entities from card text
  function cleanCardText(text: string): string {
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<br>/g, "\n")
      .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
      .trim();
  }

  // Map of card set name to cards
  const cardSets: Record<string, GundamCard[]> = {
    ST01: st01Cards as GundamCard[],
    ST02: st02Cards as GundamCard[],
    ST03: st03Cards as GundamCard[],
    ST04: st04Cards as GundamCard[],
    GD01: gd01Cards as GundamCard[],
    Beta: betaCards as GundamCard[],
    Promotion: promotionCards as GundamCard[],
  };

  // Test a random sample of cards from each set
  describe("Sample Cards From Each Set", () => {
    Object.entries(cardSets).forEach(([setName, cards]) => {
      test(`${setName} card sample`, () => {
        // Filter out cards without effects and token/resource cards
        const cardsWithEffects = cards.filter(
          (card) =>
            card.effect &&
            card.effect !== "-" &&
            !card.cardType?.includes("TOKEN") &&
            !card.cardType?.includes("RESOURCE"),
        );

        // Limit to a small sample for performance
        const sampleSize = Math.min(5, cardsWithEffects.length);
        if (sampleSize === 0) {
          console.log(`No cards with effects found in ${setName}`);
          return;
        }

        // Select random cards
        const sampleCards: GundamCard[] = [];
        for (let i = 0; i < sampleSize; i++) {
          const randomIndex = Math.floor(
            Math.random() * cardsWithEffects.length,
          );
          if (randomIndex < cardsWithEffects.length) {
            sampleCards.push(cardsWithEffects[randomIndex]);
            cardsWithEffects.splice(randomIndex, 1);
          }
        }

        console.log(
          `Testing ${sampleCards.length} random cards from ${setName}`,
        );

        // Test each card
        let successCount = 0;
        let failCount = 0;

        sampleCards.forEach((card) => {
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
        expect(successCount).toBe(sampleCards.length);
      });
    });
  });

  // Test different ability types across all sets
  describe("Ability Types Across Sets", () => {
    // Collect cards with specific effect patterns from all sets
    function getCardsWithPattern(
      pattern: RegExp,
      limit = 7,
    ): Array<{ setName: string; card: GundamCard }> {
      const results: Array<{ setName: string; card: GundamCard }> = [];

      Object.entries(cardSets).forEach(([setName, cards]) => {
        const matches = cards.filter(
          (card) => card.effect && pattern.test(card.effect),
        );
        if (matches.length > 0) {
          // Take one card from this set if possible
          results.push({
            setName,
            card: matches[0],
          });
        }
      });

      return results.slice(0, limit);
    }

    // Test different ability patterns
    const abilityPatterns = [
      { name: "Deploy trigger", pattern: /【Deploy】/ },
      { name: "Burst trigger", pattern: /【Burst】/ },
      { name: "When Paired trigger", pattern: /【When Paired】/ },
      { name: "Attack trigger", pattern: /【Attack】/ },
      { name: "Repair keyword", pattern: /&lt;Repair/ },
      { name: "Blocker keyword", pattern: /&lt;Blocker/ },
      { name: "Drawing cards", pattern: /[Dd]raw \d/ },
    ];

    abilityPatterns.forEach(({ name, pattern }) => {
      test(`${name} ability across sets`, () => {
        const matches = getCardsWithPattern(pattern);
        console.log(`Found ${matches.length} cards with ${name} across sets`);

        matches.forEach(({ setName, card }) => {
          const cleanedText = cleanCardText(card.effect || "");
          try {
            const result = parseGundamText(cleanedText);
            expect(result.errors).toHaveLength(0);
            expect(result.abilities.length).toBeGreaterThan(0);
            console.log(`Successfully parsed ${setName} card: ${card.code}`);
          } catch (error) {
            console.log(
              `Error parsing ${setName} card ${card.code}: ${error.message}`,
            );
            // Re-throw to fail the test
            throw error;
          }
        });
      });
    });
  });

  // Test cross-set compatibility for card types
  describe("Card Types Across Sets", () => {
    const cardTypes = ["UNIT", "PILOT", "COMMAND", "BASE"];

    cardTypes.forEach((type) => {
      test(`${type} cards across sets`, () => {
        // Collect one card of this type from each set
        const typeSamples: Array<{ setName: string; card: GundamCard }> = [];

        Object.entries(cardSets).forEach(([setName, cards]) => {
          const cardsOfType = cards.filter(
            (card) =>
              card.cardType === type && card.effect && card.effect !== "-",
          );

          if (cardsOfType.length > 0) {
            typeSamples.push({
              setName,
              card: cardsOfType[0],
            });
          }
        });

        console.log(`Testing ${typeSamples.length} ${type} cards across sets`);

        typeSamples.forEach(({ setName, card }) => {
          const cleanedText = cleanCardText(card.effect || "");
          const result = parseGundamText(cleanedText);

          expect(result.errors).toHaveLength(0);
          expect(result.abilities.length).toBeGreaterThan(0);
        });
      });
    });
  });

  // Statistics about the test coverage
  test("Card data statistics", () => {
    const stats = {
      totalCards: 0,
      cardsWithEffects: 0,
      setStats: {} as Record<string, { total: number; withEffects: number }>,
    };

    // Collect statistics
    Object.entries(cardSets).forEach(([setName, cards]) => {
      stats.totalCards += cards.length;

      const cardsWithEffects = cards.filter(
        (card) =>
          card.effect &&
          card.effect !== "-" &&
          !card.cardType?.includes("TOKEN") &&
          !card.cardType?.includes("RESOURCE"),
      );

      stats.cardsWithEffects += cardsWithEffects.length;
      stats.setStats[setName] = {
        total: cards.length,
        withEffects: cardsWithEffects.length,
      };
    });

    console.log("Card Data Statistics:");
    console.log(`Total cards: ${stats.totalCards}`);
    console.log(`Cards with effects: ${stats.cardsWithEffects}`);
    console.log("Set breakdowns:");

    Object.entries(stats.setStats).forEach(([setName, setStats]) => {
      console.log(
        `- ${setName}: ${setStats.withEffects}/${setStats.total} cards with effects`,
      );
    });

    // This is just an informational test that always passes
    expect(true).toBe(true);
  });
});
