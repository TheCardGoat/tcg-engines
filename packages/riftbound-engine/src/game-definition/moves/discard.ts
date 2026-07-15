/**
 * Riftbound Discard/Trash Moves
 *
 * Moves for discarding, killing, banishing, and recycling cards.
 */

import type {
  CardId as CoreCardId,
  PlayerId as CorePlayerId,
  ZoneId as CoreZoneId,
  GameMoveDefinitions,
} from "@tcg/core";
import type { RiftboundCardMeta, RiftboundGameState, RiftboundMoves } from "../../types";

/**
 * Discard/trash move definitions
 */
export const discardMoves: Partial<
  GameMoveDefinitions<RiftboundGameState, RiftboundMoves, RiftboundCardMeta, unknown>
> = {
  banishCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.clearAllCounters(cardId as CoreCardId);
      context.zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: "banishment" as CoreZoneId,
      });
    },
  },

  burnOut: {
    reducer: (draft, context) => {
      const { playerId, opponentId } = context.params;
      const { zones } = context;

      // Get all cards in trash
      const trashCards = zones.getCardsInZone("trash" as CoreZoneId, playerId as CorePlayerId);

      // Move all trash cards to main deck
      for (const cardId of trashCards) {
        zones.moveCard({
          cardId,
          position: "bottom",
          targetZoneId: "mainDeck" as CoreZoneId,
        });
      }

      // Shuffle the deck
      zones.shuffleZone("mainDeck" as CoreZoneId, playerId as CorePlayerId);

      // Opponent gains 1 point
      const opponent = draft.players[opponentId];
      if (opponent) {
        opponent.victoryPoints += 1;

        if (opponent.victoryPoints >= draft.victoryScore) {
          draft.status = "finished";
          draft.winner = opponentId;

          context.endGame?.({
            metadata: {
              method: "burn_out",
              finalScore: opponent.victoryPoints,
            },
            reason: "victory_points",
            winner: opponentId as CorePlayerId,
          });
        }
      }
    },
  },

  discardCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: "trash" as CoreZoneId,
      });
    },
  },

  drawCard: {
    reducer: (_draft, context) => {
      const { playerId, count = 1 } = context.params;
      context.zones.drawCards({
        count,
        from: "mainDeck" as CoreZoneId,
        playerId: playerId as CorePlayerId,
        to: "hand" as CoreZoneId,
      });
    },
  },

  killUnit: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.clearAllCounters(cardId as CoreCardId);
      context.zones.moveCard({
        cardId: cardId as CoreCardId,
        targetZoneId: "trash" as CoreZoneId,
      });
    },
  },

  recycleCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.clearAllCounters(cardId as CoreCardId);
      context.zones.moveCard({
        cardId: cardId as CoreCardId,
        position: "bottom",
        targetZoneId: "mainDeck" as CoreZoneId,
      });
    },
  },
};
