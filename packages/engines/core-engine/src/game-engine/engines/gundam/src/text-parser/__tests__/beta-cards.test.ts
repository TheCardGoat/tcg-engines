import { describe, expect, test } from "@jest/globals";
import betaCards from "../../cards/imports/beta.json";
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
 * Test suite for parsing card text from Beta cards
 *
 * These tests verify that the parser correctly handles beta card texts,
 * which might contain experimental or in-development effects.
 */
describe("Beta Card Text Parser Tests", () => {
  const cards = betaCards as GundamCard[];

  // Test a sample of beta cards
  describe("Sample Beta Cards", () => {
    test("Sample beta cards", () => {
      const sampleSize = 10;
      const sampleCards = filterCardsWithEffects(cards).slice(0, sampleSize);

      console.log(`Testing ${sampleCards.length} sample beta cards`);

      runErrorCheck(sampleCards, "Beta", sampleCards.length);
    });
  });

  // Test cards with keywords
  describe("Keyword Effects", () => {
    test("Cards with various keywords", () => {
      testKeywordPatterns(cards, "Beta", KEYWORD_PATTERNS);
    });
  });

  // Test cards with timing triggers
  describe("Timing Triggers", () => {
    test("Cards with various triggers", () => {
      testTriggerPatterns(cards, "Beta", TRIGGER_PATTERNS);
    });
  });

  // Test cards by type
  describe("Card Types", () => {
    for (const type of CARD_TYPES) {
      test(`${type} cards`, () => {
        testCardsByType(cards, type, 1);
      });
    }
  });

  // Error handling test - ensure all beta cards can be parsed
  describe("Error Handling", () => {
    test("Sample of all beta cards parse without errors", () => {
      runErrorCheck(cards, "Beta", 20);
    });
  });
});
