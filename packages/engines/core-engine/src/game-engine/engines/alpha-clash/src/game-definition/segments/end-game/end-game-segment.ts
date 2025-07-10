/**
 * End Game segment for Alpha Clash
 *
 * Handles game conclusion and cleanup:
 * - Determines winner
 * - Calculates final scores
 * - Cleanup game state
 */

import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { AlphaClashGameState } from "../../../../alpha-clash-engine-types";

export const endGameSegment: SegmentConfig<AlphaClashGameState> = {
  next: undefined, // No next segment - game ends here

  onBegin: ({ G, ctx }) => {
    logger.info("==== GAME ENDING ====");

    const winner =
      typeof ctx.gameOver === "object" && ctx.gameOver
        ? (ctx.gameOver as any).winner
        : undefined;
    if (winner) {
      logger.info(`Game won by: ${winner}`);
    } else {
      logger.info("Game ended without winner");
    }

    return G;
  },

  endIf: () => true, // Always end immediately

  onEnd: ({ G }) => {
    logger.info("==== ALPHA CLASH GAME COMPLETE ====");
    return G;
  },

  turn: {
    phases: {
      gameOver: {
        start: true,

        onBegin: ({ G }) => {
          logger.info("Game over phase");
          return G;
        },

        endIf: () => true, // End immediately

        moves: {
          // No moves available - game is over
        },
      },
    },
  },
};
