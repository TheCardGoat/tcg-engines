import type { CardDefinition } from "../cards/card-definition";

/**
 * Test Card Factory
 *
 * Factory functions for creating test card definitions
 */

let cardCounter = 0;

/**
 * Create a test card definition with optional overrides
 *
 * Generates a card with sensible defaults that can be customized.
 * Each card gets a unique ID automatically.
 *
 * @param overrides - Optional properties to override defaults
 * @returns Card definition for testing
 *
 * @example
 * ```typescript
 * // Create default test card
 * const card = createTestCard();
 *
 * // Create custom creature
 * const creature = createTestCard({
 *   name: 'Dragon',
 *   type: 'creature',
 *   basePower: 5,
 *   baseToughness: 5,
 *   baseCost: 7
 * });
 *
 * // Create spell
 * const spell = createTestCard({
 *   type: 'spell',
 *   baseCost: 3
 * });
 * ```
 */
export function createTestCard(overrides?: Partial<CardDefinition>): CardDefinition {
  const id = `test-card-${cardCounter++}`;

  return {
    baseCost: 1,
    basePower: 1,
    baseToughness: 1,
    id,
    name: `Test Card ${cardCounter}`,
    type: "creature",
    ...overrides,
  };
}

/**
 * Create multiple test cards with optional overrides
 *
 * Generates an array of test cards, each with a unique ID.
 * All cards share the same overridden properties but have unique IDs.
 *
 * @param count - Number of cards to create (default: 3)
 * @param overrides - Optional properties to override defaults for all cards
 * @returns Array of card definitions
 *
 * @example
 * ```typescript
 * // Create 5 default cards
 * const cards = createTestCards(5);
 *
 * // Create 10 creatures with same stats
 * const creatures = createTestCards(10, {
 *   type: 'creature',
 *   basePower: 2,
 *   baseToughness: 2
 * });
 *
 * // Create deck of mixed cards
 * const deck = [
 *   ...createTestCards(20, { type: 'creature' }),
 *   ...createTestCards(10, { type: 'spell' })
 * ];
 * ```
 */
export function createTestCards(count = 3, overrides?: Partial<CardDefinition>): CardDefinition[] {
  const cards: CardDefinition[] = [];

  for (let i = 0; i < count; i++) {
    cards.push(createTestCard(overrides));
  }

  return cards;
}

/**
 * Reset the card counter (useful for deterministic test IDs)
 *
 * @example
 * ```typescript
 * resetCardCounter();
 * const card1 = createTestCard(); // test-card-0
 * const card2 = createTestCard(); // test-card-1
 * ```
 */
export function resetCardCounter(): void {
  cardCounter = 0;
}
