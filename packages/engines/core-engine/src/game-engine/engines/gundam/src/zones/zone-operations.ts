import type { PlayerState, ZoneType } from "../gundam-engine-types";

/**
 * Result type for explicit error handling
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Zone operation error types
 */
export type ZoneOperationError =
  | { type: "cardNotFound"; cardId: string; zone: ZoneType }
  | { type: "capacityExceeded"; zone: ZoneType; capacity: number }
  | { type: "duplicateCard"; cardId: string; zone: ZoneType };

/**
 * Zone capacity limits according to Gundam Card Game rules
 */
const ZONE_CAPACITY_LIMITS: Record<ZoneType, number | undefined> = {
  deck: undefined,
  resourceDeck: undefined,
  resourceArea: 15, // Rule 3-4-2: Maximum 15 Resources
  battleArea: 6, // Rule 3-5-2: Maximum 6 Units in battle area
  shieldBase: 1, // Rule 3-6-3: Maximum 1 Base in base section
  shieldSection: undefined,
  removalArea: undefined,
  hand: 10, // Rule 3-8-4: Maximum 10 cards in hand
  trash: undefined,
  sideboard: undefined,
} as const;

/**
 * Get all cards in a specific zone
 */
export const getCardsInZone = (
  player: PlayerState,
  zone: ZoneType,
): string[] => {
  return player.zones[zone];
};

/**
 * Get the count of cards in a specific zone
 */
export const getZoneCount = (player: PlayerState, zone: ZoneType): number => {
  return player.zones[zone].length;
};

/**
 * Validate if a zone has space for additional cards
 * @param player - The player state
 * @param zone - The zone to check
 * @returns True if zone can accept more cards, false if at capacity
 */
export const validateZoneCapacity = (
  player: PlayerState,
  zone: ZoneType,
): boolean => {
  const capacity = ZONE_CAPACITY_LIMITS[zone];

  // No capacity limit for this zone
  if (capacity === undefined) {
    return true;
  }

  const currentCount = player.zones[zone].length;
  return currentCount < capacity;
};

/**
 * Add a card to a zone with validation
 * @param player - The player state
 * @param zone - The target zone
 * @param cardId - The card ID to add
 * @param position - Position to add ('start' or 'end', default 'end')
 * @returns Result containing new player state on success, or error on failure
 */
export const addCardToZone = (
  player: PlayerState,
  zone: ZoneType,
  cardId: string,
  position: "start" | "end" = "end",
): Result<PlayerState, ZoneOperationError> => {
  // Check for duplicate card
  const existingCards = player.zones[zone];
  if (existingCards.includes(cardId)) {
    return {
      success: false,
      error: { type: "duplicateCard", cardId, zone },
    };
  }

  // Check capacity
  if (!validateZoneCapacity(player, zone)) {
    const capacity = ZONE_CAPACITY_LIMITS[zone];
    return {
      success: false,
      error: { type: "capacityExceeded", zone, capacity: capacity! },
    };
  }

  // Add card
  const newCards =
    position === "start"
      ? [cardId, ...existingCards]
      : [...existingCards, cardId];

  return {
    success: true,
    data: {
      ...player,
      zones: {
        ...player.zones,
        [zone]: newCards,
      },
    },
  };
};

/**
 * Remove a card from a zone
 * @param player - The player state
 * @param zone - The source zone
 * @param cardId - The card ID to remove
 * @returns Result containing new player state on success, or error if card not found
 */
export const removeCardFromZone = (
  player: PlayerState,
  zone: ZoneType,
  cardId: string,
): Result<PlayerState, ZoneOperationError> => {
  const cards = player.zones[zone];
  const index = cards.indexOf(cardId);

  // Card not found
  if (index === -1) {
    return {
      success: false,
      error: { type: "cardNotFound", cardId, zone },
    };
  }

  const newCards = [...cards.slice(0, index), ...cards.slice(index + 1)];

  return {
    success: true,
    data: {
      ...player,
      zones: {
        ...player.zones,
        [zone]: newCards,
      },
    },
  };
};

/**
 * Move a card from one zone to another with validation
 * @param player - The player state
 * @param sourceZone - The source zone
 * @param destZone - The destination zone
 * @param cardId - The card ID to move
 * @param position - Position to add in destination ('start' or 'end', default 'end')
 * @returns Result containing new player state on success, or error on failure
 */
export const moveCardBetweenZones = (
  player: PlayerState,
  sourceZone: ZoneType,
  destZone: ZoneType,
  cardId: string,
  position: "start" | "end" = "end",
): Result<PlayerState, ZoneOperationError> => {
  const sourceCards = player.zones[sourceZone];
  const index = sourceCards.indexOf(cardId);

  // Card not found in source
  if (index === -1) {
    return {
      success: false,
      error: { type: "cardNotFound", cardId, zone: sourceZone },
    };
  }

  // Special case: moving within same zone (reordering)
  if (sourceZone === destZone) {
    // Remove from current position
    const newCards = [
      ...sourceCards.slice(0, index),
      ...sourceCards.slice(index + 1),
    ];

    // Add to new position
    const reorderedCards =
      position === "start" ? [cardId, ...newCards] : [...newCards, cardId];

    return {
      success: true,
      data: {
        ...player,
        zones: {
          ...player.zones,
          [sourceZone]: reorderedCards,
        },
      },
    };
  }

  // Check for duplicate in destination
  const destCards = player.zones[destZone];
  if (destCards.includes(cardId)) {
    return {
      success: false,
      error: { type: "duplicateCard", cardId, zone: destZone },
    };
  }

  // Check destination capacity
  const destWithoutCard = { ...player, zones: { ...player.zones } };
  if (!validateZoneCapacity(destWithoutCard, destZone)) {
    const capacity = ZONE_CAPACITY_LIMITS[destZone];
    return {
      success: false,
      error: { type: "capacityExceeded", zone: destZone, capacity: capacity! },
    };
  }

  // Remove from source
  const newSourceCards = [
    ...sourceCards.slice(0, index),
    ...sourceCards.slice(index + 1),
  ];

  // Add to destination
  const newDestCards =
    position === "start" ? [cardId, ...destCards] : [...destCards, cardId];

  return {
    success: true,
    data: {
      ...player,
      zones: {
        ...player.zones,
        [sourceZone]: newSourceCards,
        [destZone]: newDestCards,
      },
    },
  };
};
