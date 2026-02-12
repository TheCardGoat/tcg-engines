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
  type CardId,
  type PlayerId,
  type Zone,
  addCard,
  clearZone,
  createZone,
  createZoneId,
  draw,
  getTopCard,
  getZoneSize,
  isCardInZone,
  moveCard,
  removeCard,
  shuffle,
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
      faceDown: true,
      id: createZoneId(`deck-${playerId}`),
      name: "Deck",
      ordered: true,
      owner: playerId,
      visibility: "secret",
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
export function createResourceDeckZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      faceDown: true,
      id: createZoneId(`resource-deck-${playerId}`),
      name: "Resource Deck",
      ordered: true,
      owner: playerId,
      visibility: "secret",
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
      maxSize: 10,
      name: "Hand",
      ordered: false,
      owner: playerId,
      visibility: "private", // Hand limit enforced at end of turn
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
export function createBattleAreaZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`battle-area-${playerId}`),
      maxSize: 6,
      name: "Battle Area",
      ordered: true,
      owner: playerId,
      visibility: "public", // Max 6 units in battle area
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
export function createShieldSectionZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      faceDown: true,
      id: createZoneId(`shield-section-${playerId}`),
      name: "Shield Section",
      ordered: true,
      owner: playerId,
      visibility: "secret",
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
export function createBaseSectionZone(playerId: PlayerId, baseCard?: CardId): Zone {
  return createZone(
    {
      id: createZoneId(`base-section-${playerId}`),
      maxSize: 1,
      name: "Base Section",
      ordered: false,
      owner: playerId,
      visibility: "public", // Only one base allowed
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
export function createResourceAreaZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`resource-area-${playerId}`),
      maxSize: 15,
      name: "Resource Area",
      ordered: false,
      owner: playerId,
      visibility: "public", // Max 15 resources
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
export function createTrashZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`trash-${playerId}`),
      name: "Trash",
      ordered: true,
      owner: playerId,
      visibility: "public",
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
export function createRemovalZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`removal-${playerId}`),
      name: "Removal Area",
      ordered: false,
      owner: playerId,
      visibility: "public",
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
export function createLimboZone(playerId: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`limbo-${playerId}`),
      name: "Limbo",
      ordered: true,
      owner: playerId,
      visibility: "public",
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
    baseSection: createBaseSectionZone(playerId),
    battleArea: createBattleAreaZone(playerId),
    deck: createDeckZone(playerId),
    hand: createHandZone(playerId),
    limbo: createLimboZone(playerId),
    removal: createRemovalZone(playerId),
    resourceArea: createResourceAreaZone(playerId),
    resourceDeck: createResourceDeckZone(playerId),
    shieldSection: createShieldSectionZone(playerId),
    trash: createTrashZone(playerId),
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
    cards: drawnCards,
    deck: fromZone,
    hand: toZone,
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
    battleArea: toZone,
    hand: fromZone,
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
    removedShields: drawnCards,
    shieldSection: fromZone,
    trash: toZone,
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
    removal: toZone,
    sourceZone: fromZone,
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
