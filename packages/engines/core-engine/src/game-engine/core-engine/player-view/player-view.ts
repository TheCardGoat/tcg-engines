/**
 * Player View Filtering
 *
 * Provides filtering functions to create player-specific views of the game state
 * that hide information players shouldn't see (opponent hands, deck contents, etc.)
 */

import type { CardInstance } from "../card-instance/card-instance-types";
import type { PlayerId, ZoneId } from "../types/branded-types";

/**
 * Zone visibility levels
 * - public: All players can see cards in this zone
 * - private: Only the owner can see cards in this zone
 * - secret: No one can see cards in this zone (even the owner)
 */
export type ZoneVisibility = "public" | "private" | "secret";

/**
 * Configuration for player view filtering
 */
export type PlayerViewConfig = {
  /** Zone visibility rules */
  zoneVisibility?: Record<string, ZoneVisibility>;
};

/**
 * Game state with players
 * This is a minimal interface - games can extend this with additional fields
 */
export type GameStateWithPlayers = {
  cards: CardInstance[];
  [key: string]: unknown;
};

/**
 * Hidden card marker
 */
const HIDDEN_CARD_ID = "__hidden__";

/**
 * Creates a hidden version of a card (preserves ID and structural info, hides definition)
 */
function hideCard<T extends CardInstance>(card: T): T {
  return {
    ...card,
    definitionId: HIDDEN_CARD_ID,
  };
}

/**
 * Checks if a card should be visible based on revealed flag
 */
function isRevealed(card: CardInstance): boolean {
  return card.revealed === true;
}

/**
 * Filters opponent hand cards from view
 *
 * @param cards - Array of card instances
 * @param viewingPlayerId - The player viewing the state
 * @returns Filtered cards with opponent hands hidden (unless revealed)
 *
 * @example
 * const cards = [
 *   { id: "1", owner: player1, zone: "hand", definitionId: "forest" },
 *   { id: "2", owner: player2, zone: "hand", definitionId: "mountain" }
 * ];
 * const filtered = filterOpponentHand(cards, player1);
 * // player1 can see their forest, but not player2's mountain
 */
export function filterOpponentHand<T extends CardInstance>(
  cards: T[],
  viewingPlayerId: PlayerId,
): T[] {
  return cards.map((card) => {
    // Only filter hand zone
    const isInHand = card.zone.toString().toLowerCase().includes("hand");
    if (!isInHand) {
      return card;
    }

    // Don't filter if revealed
    if (isRevealed(card)) {
      return card;
    }

    // Don't filter own cards
    if (card.owner === viewingPlayerId) {
      return card;
    }

    // Hide opponent's hand
    return hideCard(card);
  });
}

/**
 * Filters deck cards from view
 *
 * @param cards - Array of card instances
 * @returns Filtered cards with all deck contents hidden (unless revealed)
 *
 * @example
 * const cards = [
 *   { id: "1", zone: "deck", definitionId: "forest" },
 *   { id: "2", zone: "play", definitionId: "mountain" }
 * ];
 * const filtered = filterDeck(cards);
 * // Deck card is hidden, play card is visible
 */
export function filterDeck<T extends CardInstance>(cards: T[]): T[] {
  return cards.map((card) => {
    // Only filter deck zone
    const isInDeck = card.zone.toString().toLowerCase().includes("deck");
    if (!isInDeck) {
      return card;
    }

    // Don't filter if revealed
    if (isRevealed(card)) {
      return card;
    }

    // Hide deck contents
    return hideCard(card);
  });
}

/**
 * Filters face-down cards from view
 *
 * @param cards - Array of card instances
 * @returns Filtered cards with face-down cards hidden (unless revealed)
 *
 * @example
 * const cards = [
 *   { id: "1", flipped: false, definitionId: "forest" }, // Face-down
 *   { id: "2", flipped: true, definitionId: "mountain" }  // Face-up
 * ];
 * const filtered = filterFaceDownCards(cards);
 * // Face-down card is hidden, face-up card is visible
 */
export function filterFaceDownCards<T extends CardInstance>(cards: T[]): T[] {
  return cards.map((card) => {
    // Only filter face-down cards
    if (card.flipped) {
      return card;
    }

    // Don't filter if revealed
    if (isRevealed(card)) {
      return card;
    }

    // Hide face-down card
    return hideCard(card);
  });
}

/**
 * Applies zone visibility rules to filter cards
 *
 * @param cards - Array of card instances
 * @param viewingPlayerId - The player viewing the state
 * @param config - Player view configuration with zone visibility rules
 * @returns Filtered cards based on zone visibility
 *
 * @example
 * const config: PlayerViewConfig = {
 *   zoneVisibility: {
 *     hand: "private",
 *     deck: "secret",
 *     play: "public"
 *   }
 * };
 * const filtered = applyZoneVisibility(cards, player1, config);
 */
export function applyZoneVisibility<T extends CardInstance>(
  cards: T[],
  viewingPlayerId: PlayerId,
  config: PlayerViewConfig,
): T[] {
  if (!config.zoneVisibility) {
    return cards;
  }

  return cards.map((card) => {
    // Don't filter if revealed
    if (isRevealed(card)) {
      return card;
    }

    // Get visibility for this zone
    const zoneKey = card.zone.toString().toLowerCase();
    const visibility = config.zoneVisibility?.[zoneKey];

    if (!visibility) {
      // Default to public if not specified
      return card;
    }

    switch (visibility) {
      case "public":
        // Everyone can see
        return card;

      case "private":
        // Only owner can see
        if (card.owner === viewingPlayerId) {
          return card;
        }
        return hideCard(card);

      case "secret":
        // No one can see
        return hideCard(card);

      default:
        return card;
    }
  });
}

/**
 * Creates a player-specific view of the game state
 *
 * @param state - The full game state
 * @param viewingPlayerId - The player viewing the state
 * @param config - Optional configuration for view filtering
 * @returns Filtered game state for the viewing player
 *
 * @example
 * const state = {
 *   turn: 1,
 *   cards: [...]
 * };
 * const config: PlayerViewConfig = {
 *   zoneVisibility: {
 *     hand: "private",
 *     deck: "secret",
 *     play: "public"
 *   }
 * };
 * const view = createPlayerView(state, player1, config);
 */
export function createPlayerView<T extends GameStateWithPlayers>(
  state: T,
  viewingPlayerId: PlayerId,
  config?: PlayerViewConfig,
): T {
  // If no config provided, return full state (default behavior)
  if (!config) {
    return state;
  }

  // Apply all filtering rules
  let filteredCards = state.cards;

  // Apply zone visibility rules if configured
  if (config.zoneVisibility) {
    filteredCards = applyZoneVisibility(filteredCards, viewingPlayerId, config);
  }

  // Always filter face-down cards when config is provided
  filteredCards = filterFaceDownCards(filteredCards);

  // Return new state with filtered cards
  return {
    ...state,
    cards: filteredCards,
  };
}
