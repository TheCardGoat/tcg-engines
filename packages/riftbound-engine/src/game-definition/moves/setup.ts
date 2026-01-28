/**
 * Riftbound Setup Moves
 *
 * Moves for game setup: placing legends, champions, battlefields,
 * initializing decks, and drawing initial hands.
 */

import type {
  CardId as CoreCardId,
  PlayerId as CorePlayerId,
  ZoneId as CoreZoneId,
  GameMoveDefinitions,
} from "@tcg/core";
import type {
  RiftboundCardMeta,
  RiftboundGameState,
  RiftboundMoves,
} from "../../types";

/**
 * Setup move definitions
 */
export const setupMoves: Partial<
  GameMoveDefinitions<
    RiftboundGameState,
    RiftboundMoves,
    RiftboundCardMeta,
    unknown
  >
> = {
  /**
   * Place Champion Legend in Legend Zone
   *
   * The Champion Legend determines domain identity and stays in the Legend Zone
   * for the entire game. It cannot be removed, moved, or displaced.
   */
  placeLegend: {
    reducer: (_draft, context) => {
      const { legendId } = context.params;
      const { zones } = context;

      // Move legend from hand/staging to legend zone
      zones.moveCard({
        cardId: legendId as CoreCardId,
        targetZoneId: "legendZone" as CoreZoneId,
      });
    },
  },

  /**
   * Place Chosen Champion in Champion Zone
   *
   * The Chosen Champion is a Champion Unit that matches the Legend's tag.
   * It starts in the Champion Zone and can be played normally from there.
   */
  placeChampion: {
    reducer: (_draft, context) => {
      const { championId } = context.params;
      const { zones } = context;

      // Move champion from hand/staging to champion zone
      zones.moveCard({
        cardId: championId as CoreCardId,
        targetZoneId: "championZone" as CoreZoneId,
      });
    },
  },

  /**
   * Place battlefields in play
   *
   * Places the selected battlefields in the battlefield row.
   * Number of battlefields depends on game mode (2 for 1v1).
   */
  placeBattlefields: {
    reducer: (draft, context) => {
      const { battlefieldIds } = context.params;
      const { zones } = context;

      for (const battlefieldId of battlefieldIds) {
        // Move battlefield to battlefield row
        zones.moveCard({
          cardId: battlefieldId as CoreCardId,
          targetZoneId: "battlefieldRow" as CoreZoneId,
        });

        // Initialize battlefield state
        draft.battlefields[battlefieldId] = {
          id: battlefieldId,
          controller: null,
          contested: false,
        };
      }
    },
  },

  /**
   * Initialize main deck with cards
   *
   * Creates the main deck with the provided card IDs.
   * The deck should have at least 40 cards.
   */
  initializeMainDeck: {
    reducer: (_draft, context) => {
      const { cardIds } = context.params;
      const { zones } = context;

      // Add each card to the main deck
      for (const cardId of cardIds) {
        zones.moveCard({
          cardId: cardId as CoreCardId,
          targetZoneId: "mainDeck" as CoreZoneId,
          position: "bottom",
        });
      }
    },
  },

  /**
   * Initialize rune deck
   *
   * Creates the rune deck with exactly 12 runes.
   */
  initializeRuneDeck: {
    reducer: (_draft, context) => {
      const { runeIds } = context.params;
      const { zones } = context;

      // Add each rune to the rune deck
      for (const runeId of runeIds) {
        zones.moveCard({
          cardId: runeId as CoreCardId,
          targetZoneId: "runeDeck" as CoreZoneId,
          position: "bottom",
        });
      }
    },
  },

  /**
   * Shuffle both decks
   *
   * Shuffles the main deck and rune deck for a player.
   */
  shuffleDecks: {
    reducer: (_draft, context) => {
      const { playerId } = context.params;
      const { zones } = context;

      zones.shuffleZone("mainDeck" as CoreZoneId, playerId as CorePlayerId);
      zones.shuffleZone("runeDeck" as CoreZoneId, playerId as CorePlayerId);
    },
  },

  /**
   * Draw initial hand
   *
   * Draws 6 cards from the main deck to form the starting hand.
   */
  drawInitialHand: {
    reducer: (_draft, context) => {
      const { playerId } = context.params;
      const { zones } = context;

      // Draw 6 cards for initial hand
      zones.drawCards({
        from: "mainDeck" as CoreZoneId,
        to: "hand" as CoreZoneId,
        count: 6,
        playerId: playerId as CorePlayerId,
      });
    },
  },

  /**
   * Mulligan
   *
   * Returns hand to deck, shuffles, and redraws.
   * Optionally keeps some cards (partial mulligan).
   */
  mulligan: {
    reducer: (_draft, context) => {
      const { playerId, keepCards = [] } = context.params;
      const { zones } = context;

      // Get current hand
      const handCards = zones.getCardsInZone(
        "hand" as CoreZoneId,
        playerId as CorePlayerId,
      );

      // Return cards not being kept to deck
      for (const cardId of handCards) {
        if (!keepCards.includes(cardId as string)) {
          zones.moveCard({
            cardId: cardId,
            targetZoneId: "mainDeck" as CoreZoneId,
            position: "bottom",
          });
        }
      }

      // Shuffle deck
      zones.shuffleZone("mainDeck" as CoreZoneId, playerId as CorePlayerId);

      // Draw back to 6 cards
      const cardsToKeep = keepCards.length;
      const cardsToDraw = 6 - cardsToKeep;

      if (cardsToDraw > 0) {
        zones.drawCards({
          from: "mainDeck" as CoreZoneId,
          to: "hand" as CoreZoneId,
          count: cardsToDraw,
          playerId: playerId as CorePlayerId,
        });
      }
    },
  },
};
