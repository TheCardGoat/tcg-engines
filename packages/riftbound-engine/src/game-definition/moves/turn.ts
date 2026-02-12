/**
 * Riftbound Turn Structure Moves
 *
 * Moves for turn management: advancing phases, ending turns,
 * passing priority, conceding, and readying cards.
 */

import type {
  CardId as CoreCardId,
  PlayerId as CorePlayerId,
  GameMoveDefinitions,
} from "@tcg/core";
import type { PlayerId, RiftboundCardMeta, RiftboundGameState, RiftboundMoves } from "../../types";

/**
 * Turn structure move definitions
 */
export const turnMoves: Partial<
  GameMoveDefinitions<RiftboundGameState, RiftboundMoves, RiftboundCardMeta, unknown>
> = {
  /**
   * Advance to next phase
   *
   * Moves the game to the next phase in the turn sequence.
   * Uses the flow system to handle phase transitions.
   */
  advancePhase: {
    reducer: (_draft, context) => {
      // Use the flow system to advance phase
      context.flow?.endPhase();
    },
  },

  /**
   * End current turn
   *
   * Ends the current player's turn and passes to the next player.
   * Clears turn-based tracking (conquered/scored battlefields).
   */
  endTurn: {
    reducer: (draft, context) => {
      const { playerId } = context.params;

      // Clear turn-based tracking for this player
      draft.conqueredThisTurn[playerId] = [];
      draft.scoredThisTurn[playerId] = [];

      // Use the flow system to end turn
      context.flow?.endTurn();
    },
  },

  /**
   * Pass priority
   *
   * Player passes without taking an action.
   * This is a no-op move used for priority passing.
   */
  pass: {
    reducer: (_draft, _context) => {
      // No state change - just passing priority
    },
  },

  /**
   * Concede the game
   *
   * Player forfeits the game. The opponent wins.
   */
  concede: {
    reducer: (draft, context) => {
      const { playerId } = context.params;

      // Find the opponent
      const playerIds = Object.keys(draft.players);
      const opponentId = playerIds.find((id) => id !== playerId);

      // Set game as finished with opponent as winner
      draft.status = "finished";
      draft.winner = opponentId;

      // Also use the endGame function if available
      context.endGame?.({
        metadata: { concededBy: playerId },
        reason: "concede",
        winner: opponentId as CorePlayerId,
      });
    },
  },

  /**
   * Ready all game objects (Awaken phase)
   *
   * Readies all exhausted game objects controlled by the player.
   * This happens automatically at the start of each turn.
   */
  readyAll: {
    reducer: (_draft, context) => {
      const { playerId } = context.params;
      const { counters } = context;

      // Get all exhausted cards owned by this player
      const exhaustedCards = counters.getCardsWithFlag("exhausted", true);

      // Ready each card owned by this player
      for (const cardId of exhaustedCards) {
        const owner = context.cards.getCardOwner(cardId);
        if ((owner as string) === playerId) {
          counters.setFlag(cardId, "exhausted", false);
        }
      }
    },
  },

  /**
   * Empty rune pool
   *
   * Clears all energy and power from the player's rune pool.
   * This happens at the end of Draw Phase and end of turn.
   */
  emptyRunePool: {
    reducer: (draft, context) => {
      const { playerId } = context.params;

      const pool = draft.runePools[playerId];
      if (pool) {
        pool.energy = 0;
        pool.power = {};
      }
    },
  },
};
