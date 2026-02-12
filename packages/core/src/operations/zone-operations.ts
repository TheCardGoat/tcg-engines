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

  /**
   * Draw cards from one zone to another
   *
   * High-level utility that moves multiple cards from source to target zone.
   * Commonly used for drawing cards from deck to hand.
   *
   * @param params - Draw parameters
   * @param params.from - Source zone ID (e.g., 'deck')
   * @param params.to - Target zone ID (e.g., 'hand')
   * @param params.count - Number of cards to draw
   * @param params.playerId - Player ID for player-specific zones
   * @returns Array of card IDs that were drawn
   *
   * @example
   * ```typescript
   * // Draw 5 cards from deck to hand
   * const drawnCards = zones.drawCards({
   *   from: 'deck',
   *   to: 'hand',
   *   count: 5,
   *   playerId: 'player-1'
   * });
   * ```
   */
  drawCards(params: { from: ZoneId; to: ZoneId; count: number; playerId: PlayerId }): CardId[];

  /**
   * Perform mulligan - shuffle hand back into deck and redraw
   *
   * High-level utility for standard mulligan operation:
   * 1. Move all cards from hand to deck
   * 2. Shuffle deck
   * 3. Draw the specified number of cards
   *
   * @param params - Mulligan parameters
   * @param params.hand - Hand zone ID
   * @param params.deck - Deck zone ID
   * @param params.drawCount - Number of cards to draw after shuffle
   * @param params.playerId - Player ID
   *
   * @example
   * ```typescript
   * // Mulligan: shuffle hand back and draw 7 new cards
   * zones.mulligan({
   *   hand: 'hand',
   *   deck: 'deck',
   *   drawCount: 7,
   *   playerId: 'player-1'
   * });
   * ```
   */
  mulligan(params: { hand: ZoneId; deck: ZoneId; drawCount: number; playerId: PlayerId }): void;

  /**
   * Move multiple cards in bulk
   *
   * High-level utility for moving many cards at once.
   * Commonly used for setup operations like placing shields.
   *
   * @param params - Bulk move parameters
   * @param params.from - Source zone ID
   * @param params.to - Target zone ID
   * @param params.count - Number of cards to move
   * @param params.playerId - Player ID
   * @param params.position - Where to place cards ('top' or 'bottom', default 'bottom')
   * @returns Array of card IDs that were moved
   *
   * @example
   * ```typescript
   * // Move 6 cards from deck to shields
   * zones.bulkMove({
   *   from: 'deck',
   *   to: 'shieldSection',
   *   count: 6,
   *   playerId: 'player-1'
   * });
   * ```
   */
  bulkMove(params: {
    from: ZoneId;
    to: ZoneId;
    count: number;
    playerId: PlayerId;
    position?: "top" | "bottom";
  }): CardId[];

  /**
   * Create a deck with placeholder cards
   *
   * High-level utility for game setup. Creates card instances and
   * places them in the specified zone.
   *
   * @param params - Deck creation parameters
   * @param params.zoneId - Zone to place the cards in
   * @param params.playerId - Owner of the cards
   * @param params.cardCount - Number of cards to create
   * @param params.shuffle - Whether to shuffle after creation (default false)
   * @returns Array of created card IDs
   *
   * @example
   * ```typescript
   * // Create and shuffle a 50-card deck
   * zones.createDeck({
   *   zoneId: 'deck',
   *   playerId: 'player-1',
   *   cardCount: 50,
   *   shuffle: true
   * });
   * ```
   */
  createDeck(params: {
    zoneId: ZoneId;
    playerId: PlayerId;
    cardCount: number;
    shuffle?: boolean;
  }): CardId[];
}
