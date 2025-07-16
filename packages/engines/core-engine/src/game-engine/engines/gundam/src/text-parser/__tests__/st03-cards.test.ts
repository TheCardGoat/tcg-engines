import { describe, expect, test } from "@jest/globals";
import st03Cards from "../../cards/imports/st03.json";
import {
  CARD_TYPES,
  filterCardsWithEffects,
  type GundamCard,
  KEYWORD_PATTERNS,
  runErrorCheck,
  TRIGGER_PATTERNS,
  testCardsByType,
  testKeywordPatterns,
  testTriggerPatterns,
} from "./test-utils";

/**
 * Test suite for parsing card text from ST03 (Fierce Attack) set
 *
 * These tests verify that the parser correctly handles various effect types
 * including keyword abilities, triggered abilities, and more complex effects.
 */
describe("ST03 Card Text Parser Tests", () => {
  const cards = st03Cards as GundamCard[];

  // Test cards with specific effect types
  describe("Keyword Effects", () => {
    test("Cards with various keywords", () => {
      // Test common keywords plus ST03-specific ones
      const st03Keywords = {
        ...KEYWORD_PATTERNS,
        breach: /&lt;Breach/, // ST03-specific keyword
      };

      testKeywordPatterns(cards, "ST03", st03Keywords);
    });
  });

  describe("Timing Triggers", () => {
    test("Cards with various triggers", () => {
      testTriggerPatterns(cards, "ST03", TRIGGER_PATTERNS);
    });
  });

  // Test a sampling of cards from the set
  describe("Selected ST03 Cards", () => {
    test("Sample cards from set", () => {
      // Test the first 5 cards with effects
      const cardSample = filterCardsWithEffects(cards).slice(0, 5);

      console.log(`Testing ${cardSample.length} sample cards from ST03`);

      cardSample.forEach((card) => {
        runErrorCheck([card], `${card.code} (${card.name})`, 1);
      });
    });
  });

  // Test cards of each type
  describe("Card Types", () => {
    CARD_TYPES.forEach((type) => {
      test(`${type} cards`, () => {
        testCardsByType(cards, type, 1);
      });
    });
  });

  // Test all cards in the set
  describe("Complete ST03 Set Test", () => {
    test("All cards can be parsed without errors", () => {
      runErrorCheck(cards, "ST03", 10);
    });
  });
});
