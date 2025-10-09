import { produce } from "immer";
import seedrandom from "seedrandom";
import type { CardId } from "../types";
import type { Zone } from "./zone";

/**
 * Adds a card to a zone
 * @param zone - Target zone
 * @param cardId - Card to add
 * @param position - Optional position for ordered zones
 * @returns Updated zone
 * @throws Error if zone is at maximum size
 */
export function addCard(zone: Zone, cardId: CardId, position?: number): Zone {
  if (
    zone.config.maxSize !== undefined &&
    zone.cards.length >= zone.config.maxSize
  ) {
    throw new Error(
      `Cannot add card: zone is at maximum size (${zone.config.maxSize})`,
    );
  }

  return produce(zone, (draft) => {
    if (position !== undefined) {
      draft.cards.splice(position, 0, cardId);
    } else {
      draft.cards.push(cardId);
    }
  });
}

/**
 * Removes a card from a zone
 * @param zone - Source zone
 * @param cardId - Card to remove
 * @returns Updated zone
 * @throws Error if card not found in zone
 */
export function removeCard(zone: Zone, cardId: CardId): Zone {
  const index = zone.cards.indexOf(cardId);
  if (index === -1) {
    throw new Error(`Card ${cardId} not found in zone ${zone.config.id}`);
  }

  return produce(zone, (draft) => {
    draft.cards.splice(index, 1);
  });
}

/**
 * Moves a card from one zone to another
 * @param fromZone - Source zone
 * @param toZone - Destination zone
 * @param cardId - Card to move
 * @param position - Optional position in destination zone
 * @returns Updated zones
 */
export function moveCard(
  fromZone: Zone,
  toZone: Zone,
  cardId: CardId,
  position?: number,
): { fromZone: Zone; toZone: Zone } {
  const updatedFrom = removeCard(fromZone, cardId);
  const updatedTo = addCard(toZone, cardId, position);

  return {
    fromZone: updatedFrom,
    toZone: updatedTo,
  };
}

/**
 * Draws cards from deck to hand
 * @param deck - Source deck zone
 * @param hand - Destination hand zone
 * @param count - Number of cards to draw
 * @returns Updated zones and drawn cards
 * @throws Error if not enough cards in deck
 */
export function draw(
  deck: Zone,
  hand: Zone,
  count: number,
): { fromZone: Zone; toZone: Zone; drawnCards: CardId[] } {
  if (deck.cards.length < count) {
    throw new Error(
      `Cannot draw ${count} cards: only ${deck.cards.length} available in ${deck.config.id}`,
    );
  }

  const drawnCards = deck.cards.slice(0, count);

  const newDeck = produce(deck, (draft) => {
    draft.cards.splice(0, count);
  });

  const newHand = produce(hand, (draft) => {
    draft.cards.push(...drawnCards);
  });

  return {
    fromZone: newDeck,
    toZone: newHand,
    drawnCards,
  };
}

/**
 * Shuffles a zone using seeded RNG for deterministic replay
 * @param zone - Zone to shuffle
 * @param seed - Random seed for determinism
 * @returns Updated zone with shuffled cards
 */
export function shuffle(zone: Zone, seed: string): Zone {
  const rng = seedrandom(seed);

  return produce(zone, (draft) => {
    // Fisher-Yates shuffle with seeded RNG
    for (let i = draft.cards.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const cardI = draft.cards[i];
      const cardJ = draft.cards[j];
      if (cardI !== undefined && cardJ !== undefined) {
        draft.cards[i] = cardJ;
        draft.cards[j] = cardI;
      }
    }
  });
}

/**
 * Searches a zone for cards matching a filter
 * @param zone - Zone to search
 * @param filter - Filter function
 * @returns Array of matching card IDs
 */
export function search(
  zone: Zone,
  filter: (cardId: CardId) => boolean,
): CardId[] {
  return zone.cards.filter(filter);
}

/**
 * Peeks at the top N cards of a zone without removing them
 * @param zone - Zone to peek at
 * @param count - Number of cards to peek
 * @returns Array of card IDs
 */
export function peek(zone: Zone, count: number): CardId[] {
  return zone.cards.slice(0, count);
}

/**
 * Mills cards from deck to graveyard
 * @param deck - Source deck zone
 * @param graveyard - Destination graveyard zone
 * @param count - Number of cards to mill
 * @returns Updated zones and milled cards
 */
export function mill(
  deck: Zone,
  graveyard: Zone,
  count: number,
): { fromZone: Zone; toZone: Zone; milledCards: CardId[] } {
  const milledCards = deck.cards.slice(0, count);

  const newDeck = produce(deck, (draft) => {
    draft.cards.splice(0, count);
  });

  const newGraveyard = produce(graveyard, (draft) => {
    draft.cards.push(...milledCards);
  });

  return {
    fromZone: newDeck,
    toZone: newGraveyard,
    milledCards,
  };
}

/**
 * Reveals cards (makes them temporarily visible)
 * @param cardIds - Cards to reveal
 * @returns Array of revealed card IDs
 */
export function reveal(cardIds: CardId[]): CardId[] {
  return [...cardIds];
}

/**
 * Gets the number of cards in a zone
 * @param zone - Zone to query
 * @returns Number of cards
 */
export function getZoneSize(zone: Zone): number {
  return zone.cards.length;
}

/**
 * Gets all cards in a zone
 * @param zone - Zone to query
 * @returns Array of card IDs
 */
export function getCardsInZone(zone: Zone): CardId[] {
  return [...zone.cards];
}

/**
 * Gets the top card of a zone
 * @param zone - Zone to query
 * @returns Top card ID or undefined if empty
 */
export function getTopCard(zone: Zone): CardId | undefined {
  return zone.cards[0];
}

/**
 * Gets the bottom card of a zone
 * @param zone - Zone to query
 * @returns Bottom card ID or undefined if empty
 */
export function getBottomCard(zone: Zone): CardId | undefined {
  return zone.cards[zone.cards.length - 1];
}

/**
 * Checks if a card is in a zone
 * @param zone - Zone to check
 * @param cardId - Card to look for
 * @returns True if card is in zone
 */
export function isCardInZone(zone: Zone, cardId: CardId): boolean {
  return zone.cards.includes(cardId);
}

/**
 * Adds a card to the top of a zone
 * @param zone - Target zone
 * @param cardId - Card to add
 * @returns Updated zone
 * @throws Error if zone is at maximum size
 */
export function addCardToTop(zone: Zone, cardId: CardId): Zone {
  if (
    zone.config.maxSize !== undefined &&
    zone.cards.length >= zone.config.maxSize
  ) {
    throw new Error(
      `Cannot add card: zone is at maximum size (${zone.config.maxSize})`,
    );
  }

  return produce(zone, (draft) => {
    draft.cards.unshift(cardId);
  });
}

/**
 * Adds a card to the bottom of a zone
 * @param zone - Target zone
 * @param cardId - Card to add
 * @returns Updated zone
 * @throws Error if zone is at maximum size
 */
export function addCardToBottom(zone: Zone, cardId: CardId): Zone {
  if (
    zone.config.maxSize !== undefined &&
    zone.cards.length >= zone.config.maxSize
  ) {
    throw new Error(
      `Cannot add card: zone is at maximum size (${zone.config.maxSize})`,
    );
  }

  return produce(zone, (draft) => {
    draft.cards.push(cardId);
  });
}

/**
 * Clears all cards from a zone
 * @param zone - Zone to clear
 * @returns Updated zone with no cards
 */
export function clearZone(zone: Zone): Zone {
  return produce(zone, (draft) => {
    draft.cards = [];
  });
}

/**
 * Finds the first zone containing a card
 * @param cardId - Card to find
 * @param zones - Zones to search
 * @returns First zone containing the card, or undefined if not found
 */
export function findCardInZones(
  cardId: CardId,
  zones: Zone[],
): Zone | undefined {
  return zones.find((zone) => isCardInZone(zone, cardId));
}
