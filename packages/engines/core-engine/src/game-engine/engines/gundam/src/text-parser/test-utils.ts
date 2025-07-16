import { parseGundamText } from "./parser";
import type { GundamParseResult } from "./types";

// Declare expect as optional for type checking compatibility
declare const expect: any | undefined;

// Common interface for card objects
export interface GundamCard {
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
 * Helper function to clean HTML entities from card text
 */
export function cleanCardText(text: string): string {
  if (!text) return "";

  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br>/g, "\n")
    .replace(/【(.+?)】/g, "【$1】\n") // Add newlines after timing markers
    .trim();
}

/**
 * Helper function to extract trigger type from text
 */
export function extractTriggerType(text: string): string | undefined {
  if (text.includes("【Deploy】")) return "deploy";
  if (text.includes("【Attack】")) return "attack";
  if (text.includes("【Burst】")) return "burst";
  if (text.includes("【When Paired】")) return "when-paired";
  if (text.includes("【During Pair】")) return "during-pair";
  if (text.includes("【When Destroyed】")) return "when-destroyed";
  if (text.includes("【Main】")) return "main";
  return undefined;
}

/**
 * Enhanced test for card abilities
 *
 * This provides more detailed validation for ability structures,
 * especially for ST02 cards that have complex triggered abilities.
 *
 * Note: This function is designed for test environments where expect is available.
 * In non-test environments, it will return a validation result instead.
 */
export function testCardAbilities(
  card: GundamCard,
  expectedAbilities?: any[],
): GundamParseResult | void {
  const cardText = cleanCardText(card.effect || "");
  const result = parseGundamText(cardText);

  // If we're in a test environment (expect is available), use it
  if (typeof expect !== "undefined") {
    // Basic validation
    expect(result).toBeDefined();
    expect(result.errors).toHaveLength(0);

    // Should have at least one ability for non-empty text
    if (cardText.length > 0) {
      expect(result.abilities.length).toBeGreaterThan(0);
    }

    // If expected abilities are provided, validate them
    if (expectedAbilities) {
      expect(result.abilities.length).toEqual(expectedAbilities.length);

      // Match by ability type first
      for (let i = 0; i < expectedAbilities.length; i++) {
        const expected = expectedAbilities[i];
        const matchingAbility = result.abilities.find(
          (a) => a.type === expected.type,
        );

        expect(matchingAbility).toBeDefined();

        if (expected.type === "triggered") {
          expect(matchingAbility?.trigger?.event).toEqual(
            expected.trigger?.event,
          );
        }

        if (expected.effects && matchingAbility?.effects) {
          expect(matchingAbility.effects.length).toEqual(
            expected.effects.length,
          );
        }
      }
    }
  } else {
    // In non-test environments, return the result for manual validation
    return result;
  }
}

/**
 * Validate card abilities without using Jest expect
 * Returns validation results that can be checked programmatically
 */
export function validateCardAbilities(
  card: GundamCard,
  expectedAbilities?: any[],
): {
  success: boolean;
  errors: string[];
  result: GundamParseResult;
} {
  const cardText = cleanCardText(card.effect || "");
  const result = parseGundamText(cardText);
  const errors: string[] = [];

  // Basic validation
  if (result) {
    if (result.errors.length > 0) {
      errors.push(`Parse errors: ${result.errors.join(", ")}`);
    }

    // Should have at least one ability for non-empty text
    if (cardText.length > 0 && result.abilities.length === 0) {
      errors.push("Expected at least one ability for non-empty text");
    }

    // If expected abilities are provided, validate them
    if (expectedAbilities) {
      if (result.abilities.length !== expectedAbilities.length) {
        errors.push(
          `Expected ${expectedAbilities.length} abilities, got ${result.abilities.length}`,
        );
      }

      // Match by ability type first
      for (let i = 0; i < expectedAbilities.length; i++) {
        const expected = expectedAbilities[i];
        const matchingAbility = result.abilities.find(
          (a) => a.type === expected.type,
        );

        if (!matchingAbility) {
          errors.push(`Expected ability of type ${expected.type} not found`);
          continue;
        }

        if (
          expected.type === "triggered" &&
          expected.trigger?.event !== matchingAbility.trigger?.event
        ) {
          errors.push(
            `Expected trigger event ${expected.trigger?.event}, got ${matchingAbility.trigger?.event}`,
          );
        }

        if (
          expected.effects &&
          matchingAbility.effects &&
          matchingAbility.effects.length !== expected.effects.length
        ) {
          errors.push(
            `Expected ${expected.effects.length} effects, got ${matchingAbility.effects.length}`,
          );
        }
      }
    }
  } else {
    errors.push("Result is undefined");
  }

  return {
    success: errors.length === 0,
    errors,
    result,
  };
}

/**
 * Common trigger patterns for testing
 */
export const TRIGGER_PATTERNS = {
  deploy: /【Deploy】/,
  attack: /【Attack】/,
  burst: /【Burst】/,
  whenPaired: /【When Paired】/,
  duringPair: /【During Pair】/,
  whenDestroyed: /【When Destroyed】/,
  main: /【Main】/,
} as const;
