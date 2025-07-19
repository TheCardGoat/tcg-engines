import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import { logger } from "~/game-engine/core-engine/utils/logger";
import { onePieceMoves } from "~/game-engine/engines/one-piece/src/moves/moves";
import type { OnePieceGameState } from "~/game-engine/engines/one-piece/src/one-piece-engine-types";

/**
 * End Game Segment for One Piece TCG
 *
 * Handles the conclusion of the game when a player meets a defeat condition:
 * 1. Player has 0 Life cards and Leader takes damage
 * 2. Player has 0 cards in deck at start of turn
 * 3. Player concedes
 * 4. Special card effects cause win/loss
 */
export const endGameSegment: SegmentConfig<OnePieceGameState> = {
  next: undefined, // Terminal segment

  onBegin: ({ G, coreOps }) => {
    return G;
  },

  endIf: () => false, // Terminal segment never ends

  onEnd: ({ G }) => {
    // This should never be called since endIf returns false
    return G;
  },

  turn: {
    phases: {
      gameOver: {
        start: true,

        onBegin: ({ G, coreOps }) => {
          logger.info("Game Over - Final state reached");
          return G;
        },

        endIf: () => false, // Game is over, no further phases

        moves: {
          // Only allow concede move in case players want to formally end
          concede: onePieceMoves.concede,
        },
      },
    },
  },
};
