import { expect } from "bun:test";
import { parseGundamText } from "../index";

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
 * Filter cards to only include those with meaningful effects
 */
export function filterCardsWithEffects(cards: GundamCard[]): GundamCard[] {
  return cards.filter(
    (card) =>
      card.effect &&
      card.effect !== "-" &&
      !card.cardType?.includes("TOKEN") &&
      !card.cardType?.includes("RESOURCE"),
  );
}

/**
 * Create a standardized test for a single card
 */
export function createCardTest(
  card: GundamCard,
  testFn: (name: string, fn: () => void) => void,
) {
  const cardCode = card.code;
  const cardName = card.name;
  const cardText = card.effect || "";

  testFn(`${cardCode} - ${cardName}`, () => {
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

/**
 * Test cards with a specific pattern/keyword
 */
export function testCardsWithPattern(
  cards: GundamCard[],
  pattern: RegExp,
  patternName: string,
  limit = 1,
): void {
  const matchingCards = cards
    .filter((card) => card.effect && pattern.test(card.effect))
    .slice(0, limit);

  console.log(`Found ${matchingCards.length} cards with ${patternName}`);

  // Debug: Show the actual card text for matching cards
  if (matchingCards.length > 0) {
    console.log(
      `Example card with ${patternName}:`,
      matchingCards[0].code,
      cleanCardText(matchingCards[0].effect || ""),
    );
  }

  matchingCards.forEach((card) => {
    const cleanedText = cleanCardText(card.effect || "");
    const result = parseGundamText(cleanedText);

    // Debug: Show parsed results for troubleshooting
    console.log(`${card.code} - ${patternName} parsing:`, {
      text: cleanedText,
      hasAbilities: result.abilities.length > 0,
      clauses: result.clauses.map((c) => c.type),
      errors: result.errors,
      warnings: result.warnings,
    });

    expect(result.abilities.length).toBeGreaterThan(0);
    expect(result.errors).toHaveLength(0);
  });
}

/**
 * Test cards by their card type
 */
export function testCardsByType(
  cards: GundamCard[],
  cardType: string,
  limit = 2,
): void {
  const typeCards = cards
    .filter(
      (card) =>
        card.cardType === cardType && card.effect && card.effect !== "-",
    )
    .slice(0, limit);

  console.log(`Testing ${typeCards.length} ${cardType} cards`);

  // Debug: Show example card info
  if (typeCards.length > 0) {
    console.log(
      `Example ${cardType} card:`,
      typeCards[0].code,
      cleanCardText(typeCards[0].effect || ""),
    );
  }

  typeCards.forEach((card) => {
    const cleanedText = cleanCardText(card.effect || "");
    const result = parseGundamText(cleanedText);

    // Debug: Show parsed results for troubleshooting
    console.log(`${card.code} - ${cardType} parsing:`, {
      text: cleanedText,
      hasAbilities: result.abilities.length > 0,
      clauses: result.clauses.map((c) => c.type),
      effects: result.clauses.flatMap((c) => c.effects.map((e) => e.type)),
      errors: result.errors,
      warnings: result.warnings,
    });

    expect(result.abilities.length).toBeGreaterThan(0);
    expect(result.errors).toHaveLength(0);
  });
}

/**
 * Run comprehensive error checking on a set of cards
 */
export function runErrorCheck(
  cards: GundamCard[],
  setName: string,
  sampleSize = 10,
): void {
  const cardsWithEffects = filterCardsWithEffects(cards);
  const sampleCards = cardsWithEffects.slice(
    0,
    Math.min(sampleSize, cardsWithEffects.length),
  );

  console.log(`Error checking ${sampleCards.length} ${setName} cards`);

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
        `Error parsing ${card.code} (${card.name}): ${(error as Error).message}`,
      );
    }
  });

  console.log(
    `Successfully parsed ${successCount}/${sampleCards.length} ${setName} cards`,
  );

  expect(failCount).toBe(0);
  expect(successCount).toBe(sampleCards.length);
}

/**
 * Get a random sample of cards for testing
 */
export function getRandomSample(
  cards: GundamCard[],
  sampleSize: number,
): GundamCard[] {
  const cardsWithEffects = filterCardsWithEffects(cards);
  const randomCards: GundamCard[] = [];
  const availableCards = [...cardsWithEffects]; // Create a copy

  for (let i = 0; i < Math.min(sampleSize, availableCards.length); i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    randomCards.push(availableCards[randomIndex]);
    availableCards.splice(randomIndex, 1); // Remove to avoid duplicates
  }

  return randomCards;
}

/**
 * Common keyword patterns for testing
 */
export const KEYWORD_PATTERNS = {
  repair: /&lt;Repair/,
  blocker: /&lt;Blocker/,
  breach: /&lt;Breach/,
  support: /&lt;Support/,
  rush: /&lt;Rush/,
  pierce: /&lt;Pierce/,
  intercept: /&lt;Intercept/,
  stealth: /&lt;Stealth/,
} as const;

/**
 * Common trigger patterns for testing
 */
export const TRIGGER_PATTERNS = {
  deploy: /【Deploy】/,
  attack: /【Attack】/,
  burst: /【Burst】/,
  whenPaired: /【When Paired】/,
  whenDestroyed: /【When Destroyed】/,
  duringYourTurn: /【During Your Turn】/,
  duringEnemyTurn: /【During Enemy's Turn】/,
  main: /【Main】/,
} as const;

/**
 * Common card types for testing
 */
export const CARD_TYPES = ["UNIT", "PILOT", "COMMAND", "BASE"] as const;

/**
 * Test a set of keyword patterns against a card set
 */
export function testKeywordPatterns(
  cards: GundamCard[],
  setName: string,
  patterns: Record<string, RegExp> = KEYWORD_PATTERNS,
): void {
  Object.entries(patterns).forEach(([name, pattern]) => {
    const matchingCards = cards.filter(
      (card) => card.effect && pattern.test(card.effect),
    );

    if (matchingCards.length > 0) {
      console.log(
        `Found ${matchingCards.length} ${setName} cards with ${name}`,
      );

      // Test the first matching card
      const card = matchingCards[0];
      const cleanedText = cleanCardText(card.effect || "");
      const result = parseGundamText(cleanedText);

      expect(result.abilities.length).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    } else {
      console.log(`No ${setName} cards with ${name} found`);
    }
  });
}

/**
 * Test a set of trigger patterns against a card set
 */
export function testTriggerPatterns(
  cards: GundamCard[],
  setName: string,
  patterns: Record<string, RegExp> = TRIGGER_PATTERNS,
): void {
  Object.entries(patterns).forEach(([name, pattern]) => {
    const matchingCards = cards.filter(
      (card) => card.effect && pattern.test(card.effect),
    );

    if (matchingCards.length > 0) {
      console.log(
        `Found ${matchingCards.length} ${setName} cards with ${name} trigger`,
      );

      // Debug: Show example card with trigger
      console.log(
        `Example ${name} trigger:`,
        matchingCards[0].code,
        cleanCardText(matchingCards[0].effect || ""),
      );

      // Test the first matching card
      const card = matchingCards[0];
      const cleanedText = cleanCardText(card.effect || "");
      const result = parseGundamText(cleanedText);

      // Debug: Show detailed parser results
      console.log(`${name} trigger parsing result:`, {
        text: cleanedText,
        hasAbilities: result.abilities.length > 0,
        abilities: result.abilities.map((a) => ({
          type: a.type,
          trigger: a.trigger?.event,
          effects: a.effects?.map((e) => e.type),
        })),
        clauses: result.clauses.map((c) => ({
          type: c.type,
          timing: c.timingType,
          effectCount: c.effects.length,
        })),
        errors: result.errors,
      });

      expect(result.abilities.length).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    } else {
      console.log(`No ${setName} cards with ${name} trigger found`);
    }
  });
}
