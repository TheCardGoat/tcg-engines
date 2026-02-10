/**
 * Gundam Card Game - Zone Operations
 *
 * This module provides zone operation utilities for the Gundam Card Game,
 * built on top of @tcg/core zone operations.
 *
 * Zone Structure:
 * - Deck: Main deck (50 cards)
 * - Resource Deck: Resource cards (10 cards)
 * - Hand: Player's hand (max 10 cards at end of turn)
 * - Battle Area: Units and paired Pilots (max 6 units)
 * - Shield Section: Face-down shield cards (6 at start)
 * - Base Section: Base card (max 1)
 * - Resource Area: Played resource cards (max 15)
 * - Trash: Discard pile
 * - Removal: Removed from game
 *
 * @module zones/zone-operations
 */

import {
  addCard,
  type CardId,
  clearZone,
  createZone,
  createZoneId,
  draw,
  getTopCard,
  getZoneSize,
  isCardInZone,
  moveCard,
  type PlayerId,
  removeCard,
  shuffle,
  type Zone,
} from "@tcg/core";

/**
 * Creates a deck zone for a player
 * @param playerId - Owner of the deck
 * @param cards - Initial cards in the deck
 * @returns Configured deck zone
 */
export function createDeckZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`deck-${playerId}`),
      name: "Deck",
      visibility: "secret",
      ordered: true,
      owner: playerId,
      faceDown: true,
    },
    cards,
  );
}

/**
 * Creates a resource deck zone for a player
 * @param playerId - Owner of the resource deck
 * @param cards - Initial resource cards
 * @returns Configured resource deck zone
 */
export function createResourceDeckZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`resource-deck-${playerId}`),
      name: "Resource Deck",
      visibility: "secret",
      ordered: true,
      owner: playerId,
      faceDown: true,
    },
    cards,
  );
}

/**
 * Creates a hand zone for a player
 * @param playerId - Owner of the hand
 * @param cards - Initial cards in hand
 * @returns Configured hand zone
 */
export function createHandZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`hand-${playerId}`),
      name: "Hand",
      visibility: "private",
      ordered: false,
      owner: playerId,
      maxSize: 10, // Hand limit enforced at end of turn
    },
    cards,
  );
}

/**
 * Creates a battle area zone for a player
 * @param playerId - Owner of the battle area
 * @param cards - Initial cards in battle area
 * @returns Configured battle area zone
 */
export function createBattleAreaZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`battle-area-${playerId}`),
      name: "Battle Area",
      visibility: "public",
      ordered: true,
      owner: playerId,
      maxSize: 6, // Max 6 units in battle area
    },
    cards,
  );
}

/**
 * Creates a shield section zone for a player
 * @param playerId - Owner of the shield section
 * @param cards - Initial shield cards (typically 6)
 * @returns Configured shield section zone
 */
export function createShieldSectionZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`shield-section-${playerId}`),
      name: "Shield Section",
      visibility: "secret",
      ordered: true,
      owner: playerId,
      faceDown: true,
    },
    cards,
  );
}

/**
 * Creates a base section zone for a player
 * @param playerId - Owner of the base section
 * @param baseCard - Base card (typically EX Base)
 * @returns Configured base section zone
 */
export function createBaseSectionZone(
  playerId: PlayerId,
  baseCard?: CardId,
): Zone {
  return createZone(
    {
      id: createZoneId(`base-section-${playerId}`),
      name: "Base Section",
      visibility: "public",
      ordered: false,
      owner: playerId,
      maxSize: 1, // Only one base allowed
    },
    baseCard ? [baseCard] : [],
  );
}

/**
 * Creates a resource area zone for a player
 * @param playerId - Owner of the resource area
 * @param cards - Initial resource cards
 * @returns Configured resource area zone
 */
export function createResourceAreaZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`resource-area-${playerId}`),
      name: "Resource Area",
      visibility: "public",
      ordered: false,
      owner: playerId,
      maxSize: 15, // Max 15 resources
    },
    cards,
  );
}

/**
 * Creates a trash zone for a player
 * @param playerId - Owner of the trash
 * @param cards - Initial cards in trash
 * @returns Configured trash zone
 */
export function createTrashZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`trash-${playerId}`),
      name: "Trash",
      visibility: "public",
      ordered: true,
      owner: playerId,
    },
    cards,
  );
}

/**
 * Creates a removal zone for a player
 * @param playerId - Owner of the removal area
 * @param cards - Initial removed cards
 * @returns Configured removal zone
 */
export function createRemovalZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`removal-${playerId}`),
      name: "Removal Area",
      visibility: "public",
      ordered: false,
      owner: playerId,
    },
    cards,
  );
}

/**
 * Creates a limbo zone for a player
 * @param playerId - Owner of the limbo zone
 * @param cards - Initial cards in limbo
 * @returns Configured limbo zone
 */
export function createLimboZone(
  playerId: PlayerId,
  cards: CardId[] = [],
): Zone {
  return createZone(
    {
      id: createZoneId(`limbo-${playerId}`),
      name: "Limbo",
      visibility: "public",
      ordered: true,
      owner: playerId,
    },
    cards,
  );
}

/**
 * Creates all zones for a player
 * @param playerId - Player to create zones for
 * @returns Object containing all player zones
 */
export function createPlayerZones(playerId: PlayerId) {
  return {
    deck: createDeckZone(playerId),
    resourceDeck: createResourceDeckZone(playerId),
    hand: createHandZone(playerId),
    battleArea: createBattleAreaZone(playerId),
    shieldSection: createShieldSectionZone(playerId),
    baseSection: createBaseSectionZone(playerId),
    resourceArea: createResourceAreaZone(playerId),
    trash: createTrashZone(playerId),
    removal: createRemovalZone(playerId),
    limbo: createLimboZone(playerId),
  };
}

/**
 * Draws cards from deck to hand
 * @param deck - Deck zone
 * @param hand - Hand zone
 * @param count - Number of cards to draw
 * @returns Updated zones and drawn cards
 */
export function drawCards(
  deck: Zone,
  hand: Zone,
  count: number,
): { deck: Zone; hand: Zone; cards: CardId[] } {
  const { fromZone, toZone, drawnCards } = draw(deck, hand, count);
  return {
    deck: fromZone,
    hand: toZone,
    cards: drawnCards,
  };
}

/**
 * Shuffles a deck with a seed for deterministic replay
 * @param deck - Deck zone to shuffle
 * @param seed - Random seed
 * @returns Shuffled deck
 */
export function shuffleDeck(deck: Zone, seed: string): Zone {
  return shuffle(deck, seed);
}

/**
 * Deploys a unit from hand to battle area
 * @param hand - Hand zone
 * @param battleArea - Battle area zone
 * @param cardId - Card to deploy
 * @returns Updated zones
 */
export function deployUnit(
  hand: Zone,
  battleArea: Zone,
  cardId: CardId,
): { hand: Zone; battleArea: Zone } {
  const { fromZone, toZone } = moveCard(hand, battleArea, cardId);
  return {
    hand: fromZone,
    battleArea: toZone,
  };
}

/**
 * Places a resource from hand to resource area
 * @param hand - Hand zone
 * @param resourceArea - Resource area zone
 * @param cardId - Card to place as resource
 * @returns Updated zones
 */
export function placeResource(
  hand: Zone,
  resourceArea: Zone,
  cardId: CardId,
): { hand: Zone; resourceArea: Zone } {
  const { fromZone, toZone } = moveCard(hand, resourceArea, cardId);
  return {
    hand: fromZone,
    resourceArea: toZone,
  };
}

/**
 * Destroys a unit, moving it from battle area to trash
 * @param battleArea - Battle area zone
 * @param trash - Trash zone
 * @param cardId - Card to destroy
 * @returns Updated zones
 */
export function destroyUnit(
  battleArea: Zone,
  trash: Zone,
  cardId: CardId,
): { battleArea: Zone; trash: Zone } {
  const { fromZone, toZone } = moveCard(battleArea, trash, cardId);
  return {
    battleArea: fromZone,
    trash: toZone,
  };
}

/**
 * Takes damage by removing shields
 * @param shieldSection - Shield section zone
 * @param trash - Trash zone
 * @param damage - Amount of damage (number of shields to remove)
 * @returns Updated zones and removed shields
 */
export function takeDamage(
  shieldSection: Zone,
  trash: Zone,
  damage: number,
): { shieldSection: Zone; trash: Zone; removedShields: CardId[] } {
  const { fromZone, toZone, drawnCards } = draw(shieldSection, trash, damage);
  return {
    shieldSection: fromZone,
    trash: toZone,
    removedShields: drawnCards,
  };
}

/**
 * Removes a card from game
 * @param sourceZone - Source zone
 * @param removal - Removal zone
 * @param cardId - Card to remove
 * @returns Updated zones
 */
export function removeFromGame(
  sourceZone: Zone,
  removal: Zone,
  cardId: CardId,
): { sourceZone: Zone; removal: Zone } {
  const { fromZone, toZone } = moveCard(sourceZone, removal, cardId);
  return {
    sourceZone: fromZone,
    removal: toZone,
  };
}

// Re-export commonly used core operations
export {
  addCard,
  removeCard,
  moveCard,
  isCardInZone,
  getZoneSize,
  getTopCard,
  clearZone,
  shuffle,
  draw,
};
