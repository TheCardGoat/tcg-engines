import type { CardId, PlayerId } from "../types";
import { createZoneId } from "../types";
import type { Zone, ZoneConfig } from "../zones/zone";

/**
 * Test Zone Factory
 *
 * Factory functions for creating test zones
 */

let zoneCounter = 0;

/**
 * Create a test zone with optional configuration and cards
 *
 * Generates a zone with sensible defaults that can be customized.
 * Each zone gets a unique ID automatically.
 *
 * @param configOverrides - Optional config properties to override
 * @param cards - Optional initial cards
 * @returns Zone for testing
 *
 * @example
 * ```typescript
 * // Create default zone
 * const zone = createTestZone();
 *
 * // Create zone with cards
 * const deck = createTestZone(
 *   { name: 'Deck', visibility: 'secret', ordered: true },
 *   ['card1', 'card2', 'card3']
 * );
 *
 * // Create player-owned zone
 * const hand = createTestZone({
 *   name: 'Hand',
 *   owner: 'player1',
 *   visibility: 'private'
 * });
 * ```
 */
export function createTestZone(
  configOverrides?: Partial<ZoneConfig>,
  cards: CardId[] = [],
): Zone {
  const id = createZoneId(`test-zone-${zoneCounter++}`);

  const config: ZoneConfig = {
    id,
    name: `Test Zone ${zoneCounter}`,
    visibility: "public",
    ordered: false,
    ...configOverrides,
  };

  return {
    config,
    cards: [...cards],
  };
}

/**
 * Create a test deck zone
 *
 * Creates a zone with typical deck properties:
 * - Secret visibility (no one can see cards)
 * - Ordered (card order matters)
 * - Face down
 *
 * @param cards - Optional initial cards
 * @param owner - Optional owner player ID
 * @returns Deck zone
 *
 * @example
 * ```typescript
 * const deck = createTestDeck(
 *   ['card1', 'card2', 'card3'],
 *   'player1'
 * );
 * ```
 */
export function createTestDeck(cards: CardId[] = [], owner?: PlayerId): Zone {
  const id = createZoneId(`test-deck-${zoneCounter++}`);

  return {
    config: {
      id,
      name: owner ? `${owner} Deck` : "Test Deck",
      visibility: "secret",
      ordered: true,
      faceDown: true,
      owner,
    },
    cards: [...cards],
  };
}

/**
 * Create a test hand zone
 *
 * Creates a zone with typical hand properties:
 * - Private visibility (owner can see, opponents cannot)
 * - Unordered (card order doesn't matter)
 * - Face up
 *
 * @param cards - Optional initial cards
 * @param owner - Optional owner player ID
 * @returns Hand zone
 *
 * @example
 * ```typescript
 * const hand = createTestHand(
 *   ['card1', 'card2'],
 *   'player1'
 * );
 * ```
 */
export function createTestHand(cards: CardId[] = [], owner?: PlayerId): Zone {
  const id = createZoneId(`test-hand-${zoneCounter++}`);

  return {
    config: {
      id,
      name: owner ? `${owner} Hand` : "Test Hand",
      visibility: "private",
      ordered: false,
      faceDown: false,
      owner,
    },
    cards: [...cards],
  };
}

/**
 * Create a test play area zone
 *
 * Creates a zone with typical play area properties:
 * - Public visibility (everyone can see)
 * - Unordered (card order doesn't matter)
 * - Face up
 *
 * @param cards - Optional initial cards
 * @param owner - Optional owner player ID
 * @returns Play area zone
 *
 * @example
 * ```typescript
 * const playArea = createTestPlayArea(
 *   ['creature1', 'creature2'],
 *   'player1'
 * );
 * ```
 */
export function createTestPlayArea(
  cards: CardId[] = [],
  owner?: PlayerId,
): Zone {
  const id = createZoneId(`test-play-area-${zoneCounter++}`);

  return {
    config: {
      id,
      name: owner ? `${owner} Play Area` : "Test Play Area",
      visibility: "public",
      ordered: false,
      faceDown: false,
      owner,
    },
    cards: [...cards],
  };
}

/**
 * Create a test graveyard zone
 *
 * Creates a zone with typical graveyard properties:
 * - Public visibility (everyone can see)
 * - Ordered (card order matters - cards go on top)
 * - Face up
 *
 * @param cards - Optional initial cards
 * @param owner - Optional owner player ID
 * @returns Graveyard zone
 *
 * @example
 * ```typescript
 * const graveyard = createTestGraveyard(
 *   ['dead-card1', 'dead-card2'],
 *   'player1'
 * );
 * ```
 */
export function createTestGraveyard(
  cards: CardId[] = [],
  owner?: PlayerId,
): Zone {
  const id = createZoneId(`test-graveyard-${zoneCounter++}`);

  return {
    config: {
      id,
      name: owner ? `${owner} Graveyard` : "Test Graveyard",
      visibility: "public",
      ordered: true,
      faceDown: false,
      owner,
    },
    cards: [...cards],
  };
}

/**
 * Reset the zone counter (useful for deterministic test IDs)
 *
 * @example
 * ```typescript
 * resetZoneCounter();
 * const zone1 = createTestZone(); // test-zone-0
 * const zone2 = createTestZone(); // test-zone-1
 * ```
 */
export function resetZoneCounter(): void {
  zoneCounter = 0;
}
