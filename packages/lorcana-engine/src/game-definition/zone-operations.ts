/**
 * Zone Operations
 *
 * Task 1.6: Helper functions for managing cards in zones
 *
 * Provides utilities for:
 * - Adding/removing cards from zones
 * - Moving cards between zones
 * - Querying cards in zones
 * - Creating zone state
 *
 * All operations follow Comprehensive Rules Section 8 (Zones)
 */

import type { CardId, PlayerId } from "../types/branded-types";

/**
 * Zone State
 *
 * Maps each player to their array of cards in a zone.
 * Card order is significant for ordered zones (deck, discard).
 */
export type ZoneState = Record<PlayerId, CardId[]>;

/**
 * Create empty zone state for players
 *
 * Initializes a zone with empty arrays for each player.
 *
 * @param players - Array of player IDs
 * @returns Zone state with empty arrays for each player
 *
 * @example
 * ```typescript
 * const players = [createPlayerId("p1"), createPlayerId("p2")];
 * const handZone = createZoneState(players);
 * // { p1: [], p2: [] }
 * ```
 */
export const createZoneState = (players: PlayerId[]): ZoneState => {
  const zoneState: ZoneState = {} as ZoneState;

  for (const player of players) {
    zoneState[player] = [];
  }

  return zoneState;
};

/**
 * Add card to player's zone
 *
 * Adds a card to the end of the player's zone array.
 * For ordered zones (deck, discard), this maintains sequence.
 *
 * @param zoneState - The zone state to modify
 * @param playerId - The player whose zone to add to
 * @param cardId - The card to add
 *
 * @example
 * ```typescript
 * addCardToZone(handZone, playerId, cardId);
 * ```
 */
export const addCardToZone = (
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void => {
  if (!zoneState[playerId]) {
    zoneState[playerId] = [];
  }

  zoneState[playerId].push(cardId);
};

/**
 * Remove card from player's zone
 *
 * Removes the first occurrence of a card from the player's zone.
 * Maintains order for ordered zones.
 *
 * @param zoneState - The zone state to modify
 * @param playerId - The player whose zone to remove from
 * @param cardId - The card to remove
 *
 * @example
 * ```typescript
 * removeCardFromZone(handZone, playerId, cardId);
 * ```
 */
export const removeCardFromZone = (
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void => {
  if (!zoneState[playerId]) {
    return;
  }

  const index = zoneState[playerId].indexOf(cardId);
  if (index !== -1) {
    zoneState[playerId].splice(index, 1);
  }
};

/**
 * Move card between zones
 *
 * Removes card from source zone and adds to destination zone.
 * This is the standard way to transition cards between zones.
 *
 * Rule 8.1: Zones are separate from one another
 * Rule 8.1.5: Cards entering private zones lose all info
 *
 * @param sourceZone - Zone to remove card from
 * @param destZone - Zone to add card to
 * @param playerId - The player whose zones to use
 * @param cardId - The card to move
 *
 * @example
 * ```typescript
 * // Draw card (deck -> hand)
 * moveCardBetweenZones(deckZone, handZone, playerId, topCard);
 *
 * // Play card (hand -> play)
 * moveCardBetweenZones(handZone, playZone, playerId, cardId);
 *
 * // Banish (play -> discard)
 * moveCardBetweenZones(playZone, discardZone, playerId, cardId);
 * ```
 */
export const moveCardBetweenZones = (
  sourceZone: ZoneState,
  destZone: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void => {
  removeCardFromZone(sourceZone, playerId, cardId);
  addCardToZone(destZone, playerId, cardId);
};

/**
 * Check if card is in player's zone
 *
 * @param zoneState - The zone state to check
 * @param playerId - The player whose zone to check
 * @param cardId - The card to look for
 * @returns True if card is in the player's zone
 *
 * @example
 * ```typescript
 * if (isCardInZone(handZone, playerId, cardId)) {
 *   // Card is in hand
 * }
 * ```
 */
export const isCardInZone = (
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): boolean => {
  const playerZone = zoneState[playerId];
  if (!playerZone) {
    return false;
  }

  return playerZone.includes(cardId);
};

/**
 * Get all cards in player's zone
 *
 * Returns a copy of the card array to prevent external modification.
 * For ordered zones, maintains the card sequence.
 *
 * @param zoneState - The zone state to query
 * @param playerId - The player whose cards to get
 * @returns Array of card IDs (copy)
 *
 * @example
 * ```typescript
 * const handCards = getCardsInZone(handZone, playerId);
 * const deckSize = getCardsInZone(deckZone, playerId).length;
 * ```
 */
export const getCardsInZone = (
  zoneState: ZoneState,
  playerId: PlayerId,
): CardId[] => {
  const playerZone = zoneState[playerId];
  if (!playerZone) {
    return [];
  }

  // Return copy to prevent external mutation
  return [...playerZone];
};

/**
 * Get number of cards in player's zone
 *
 * Rule 8.1.2, 8.1.3: Players can count cards in any zone
 *
 * @param zoneState - The zone state to query
 * @param playerId - The player whose cards to count
 * @returns Number of cards in zone
 *
 * @example
 * ```typescript
 * const handSize = getZoneSize(handZone, playerId);
 * const deckSize = getZoneSize(deckZone, playerId);
 * ```
 */
export const getZoneSize = (
  zoneState: ZoneState,
  playerId: PlayerId,
): number => {
  return getCardsInZone(zoneState, playerId).length;
};

/**
 * Get top card from ordered zone
 *
 * For zones like deck and discard where order matters.
 * Returns undefined if zone is empty.
 *
 * Rule 8.2.3: Draw from top of deck
 *
 * @param zoneState - The zone state to query
 * @param playerId - The player whose zone to check
 * @returns Top card ID or undefined
 *
 * @example
 * ```typescript
 * const topCard = getTopCard(deckZone, playerId);
 * if (topCard) {
 *   // Draw the top card
 *   moveCardBetweenZones(deckZone, handZone, playerId, topCard);
 * }
 * ```
 */
export const getTopCard = (
  zoneState: ZoneState,
  playerId: PlayerId,
): CardId | undefined => {
  const cards = getCardsInZone(zoneState, playerId);
  return cards[0]; // First card is top
};

/**
 * Clear all cards from player's zone
 *
 * Used for game cleanup or reset scenarios.
 *
 * @param zoneState - The zone state to modify
 * @param playerId - The player whose zone to clear
 *
 * @example
 * ```typescript
 * clearZone(handZone, playerId);
 * ```
 */
export const clearZone = (zoneState: ZoneState, playerId: PlayerId): void => {
  if (zoneState[playerId]) {
    zoneState[playerId] = [];
  }
};

/**
 * Add card to top of ordered zone
 *
 * For zones like deck where adding to top matters.
 *
 * Rule 8.2.4: Cards added to top/bottom in known order
 *
 * @param zoneState - The zone state to modify
 * @param playerId - The player whose zone to add to
 * @param cardId - The card to add
 *
 * @example
 * ```typescript
 * // Put card on top of deck
 * addCardToTop(deckZone, playerId, cardId);
 * ```
 */
export const addCardToTop = (
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void => {
  if (!zoneState[playerId]) {
    zoneState[playerId] = [];
  }

  zoneState[playerId].unshift(cardId); // Add to front
};

/**
 * Add card to bottom of ordered zone
 *
 * For zones like deck where adding to bottom matters.
 *
 * Rule 8.2.4: Cards added to top/bottom in known order
 * Rule 3.1.6.1: Mulligan cards go to bottom
 *
 * @param zoneState - The zone state to modify
 * @param playerId - The player whose zone to add to
 * @param cardId - The card to add
 *
 * @example
 * ```typescript
 * // Put card on bottom of deck (mulligan)
 * addCardToBottom(deckZone, playerId, cardId);
 * ```
 */
export const addCardToBottom = (
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void => {
  if (!zoneState[playerId]) {
    zoneState[playerId] = [];
  }

  zoneState[playerId].push(cardId); // Add to end
};
