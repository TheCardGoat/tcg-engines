import type { CardId, PlayerId, ZoneId } from "../types";

/**
 * Zone Operations Interface
 *
 * Provides API for manipulating cards between zones without directly mutating internal state.
 * These operations are the only way for moves to interact with the framework's zone management.
 *
 * All zone operations maintain consistency:
 * - Cards can only be in one zone at a time
 * - Moving a card automatically removes it from its current zone
 * - Zone order is preserved for ordered zones (like decks)
 */
export interface ZoneOperations {
  /**
   * Move a card from its current zone to a target zone
   *
   * @param args - Move card arguments
   * @param args.cardId - ID of the card to move
   * @param args.targetZoneId - ID of the zone to move the card to
   * @param args.position - Where to place the card in the target zone:
   *   - 'top': Add to the beginning (index 0)
   *   - 'bottom': Add to the end (default)
   *   - number: Insert at specific index
   *
   * @example
   * ```typescript
   * // Draw a card (deck -> hand)
   * zones.moveCard({
   *   cardId: 'card-1',
   *   targetZoneId: 'hand',
   *   position: 'bottom'
   * });
   *
   * // Put card on top of deck
   * zones.moveCard({
   *   cardId: 'card-2',
   *   targetZoneId: 'deck',
   *   position: 'top'
   * });
   * ```
   */
  moveCard(args: {
    cardId: CardId;
    targetZoneId: ZoneId;
    position?: "top" | "bottom" | number;
  }): void;

  /**
   * Get all cards in a zone
   *
   * @param zoneId - ID of the zone to query
   * @param ownerId - Optional player ID to filter by owner (for player-specific zones)
   * @returns Array of card IDs in the zone (in order for ordered zones)
   *
   * @example
   * ```typescript
   * // Get all cards in a player's hand
   * const handCards = zones.getCardsInZone('hand', 'player-1');
   *
   * // Get all cards in shared play area
   * const playCards = zones.getCardsInZone('play');
   * ```
   */
  getCardsInZone(zoneId: ZoneId, ownerId?: PlayerId): CardId[];

  /**
   * Shuffle cards in a zone
   *
   * @param zoneId - ID of the zone to shuffle
   * @param ownerId - Optional player ID for player-specific zones
   *
   * @example
   * ```typescript
   * // Shuffle a player's deck
   * zones.shuffleZone('deck', 'player-1');
   * ```
   */
  shuffleZone(zoneId: ZoneId, ownerId?: PlayerId): void;

  /**
   * Get the zone containing a card
   *
   * @param cardId - ID of the card to find
   * @returns Zone ID if card is in a zone, undefined otherwise
   *
   * @example
   * ```typescript
   * const zone = zones.getCardZone('card-1');
   * if (zone === 'hand') {
   *   // Card is in hand
   * }
   * ```
   */
  getCardZone(cardId: CardId): ZoneId | undefined;
}
