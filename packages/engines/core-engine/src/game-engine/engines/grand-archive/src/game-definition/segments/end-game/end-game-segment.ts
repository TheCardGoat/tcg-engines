/**
 * Grand Archive End Game Segment
 *
 * Handles game conclusion, winner determination, and cleanup
 */

import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { GrandArchiveGameState } from "../../../../grand-archive-engine-types";

export const endGameSegment: SegmentConfig<GrandArchiveGameState> = {
  onBegin: ({ G, ctx }) => {
    logger.info("==== END GAME SEGMENT ====");

    // Determine winner
    let winner: string | undefined;
    let winCondition = "";

    for (const playerId of ctx.playerOrder) {
      const player = ctx.players[playerId];
      if (!player) continue;

      // TODO: Check loss conditions for this player - need CoreOperation method for championDamage
      // if (player.championDamage >= 25) {
      //   const opponent = ctx.playerOrder.find((id) => id !== playerId);
      //   if (opponent) {
      //     winner = opponent;
      //     winCondition = `${playerId}'s champion was defeated`;
      //   }
      //   break;
      // }

      // Check if player ran out of cards
      const deck = ctx.cardZones?.[`${playerId}-mainDeck`];
      if (deck && deck.cards.length === 0) {
        // This player loses, opponent wins
        const opponent = ctx.playerOrder.find((id) => id !== playerId);
        if (opponent) {
          winner = opponent;
          winCondition = `${playerId} ran out of cards`;
        }
        break;
      }
    }

    // Handle draw/tie conditions
    if (!winner) {
      // TODO: Filter alive players - need CoreOperation method for championDamage
      const alivePlayers = ctx.playerOrder.filter((playerId) => {
        const player = ctx.players[playerId];
        return player; // && player.championDamage < 25;
      });

      if (alivePlayers.length === 0) {
        winCondition = "All players eliminated simultaneously";
      } else if (alivePlayers.length > 1) {
        winCondition = "Game ended without clear winner";
      }
    }

    if (winner) {
      logger.info(`Game Winner: ${winner}`);
      logger.info(`Win Condition: ${winCondition}`);
    } else {
      logger.info("Game ended in a draw");
      logger.info(`Draw Condition: ${winCondition}`);
    }

    return {
      ...G,
      currentSegment: "endGame",
      winner,
      gameEndReason: winCondition,
      gameEndTime: Date.now(),
    };
  },

  endIf: () => true, // Game is over, segment ends immediately

  onEnd: ({ G }) => {
    logger.info("Grand Archive game complete");

    // Final cleanup and statistics
    const gameDuration = G.gameEndTime ? G.gameEndTime - G.startTime : 0;
    logger.info(`Game duration: ${Math.round(gameDuration / 1000)}s`);

    return G;
  },

  turn: {
    // No turns in end game segment
    phases: {
      gameOver: {
        start: true,

        onBegin: ({ G }) => {
          logger.info("Game Over");
          return G;
        },

        endIf: () => true, // End immediately

        moves: {
          // No moves available in end game
        },
      },
    },
  },
};
