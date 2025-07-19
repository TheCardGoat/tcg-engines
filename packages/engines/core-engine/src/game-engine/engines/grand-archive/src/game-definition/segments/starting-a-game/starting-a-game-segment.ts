/**
 * Grand Archive Starting a Game Segment
 *
 * Handles pre-game setup including first player selection, champion selection,
 * and initial hand drawing following Grand Archive rules
 */

import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { GrandArchiveGameState } from "../../../../grand-archive-engine-types";
import { grandArchiveMoves } from "../../../moves/moves";

export const startingAGameSegment: SegmentConfig<GrandArchiveGameState> = {
  next: "duringGame",

  onBegin: ({ G, coreOps }) => {
    const ctx = coreOps.getCtx();

    logger.info("==== STARTING GRAND ARCHIVE GAME ====");

    // Initialize the segment
    const players = coreOps.getPlayers();
    logger.info(`Players: ${players.join(", ")}`);

    // Set up initial game state
    for (const player of players) {
      // Shuffle main deck
      coreOps.shuffleZone("mainDeck", player);
      logger.debug(`Shuffled main deck for ${player}`);

      // Shuffle material deck
      coreOps.shuffleZone("materialDeck", player);
      logger.debug(`Shuffled material deck for ${player}`);

      // Draw opening hand (5 cards in Grand Archive)
      const openingHandSize = 5;
      for (let i = 0; i < openingHandSize; i++) {
        coreOps.moveCard({
          playerId: player,
          from: "mainDeck",
          to: "hand",
          destination: "end",
        });
      }
      logger.debug(
        `Drew opening hand of ${openingHandSize} cards for ${player}`,
      );
    }

    return G;
  },

  endIf: ({ ctx }) => {
    // Segment ends when first player is chosen and all setup is complete
    return ctx.otp !== undefined && !ctx.pendingMulligan;
  },

  onEnd: ({ G, coreOps }) => {
    const ctx = coreOps.getCtx();

    logger.info("Starting a Game segment complete");

    // Set the first player as both turn and priority player
    if (ctx.otp) {
      coreOps.setPriorityPlayer(ctx.otp);
      coreOps.setTurnPlayer(ctx.otp);
      logger.info(`Game starting with ${ctx.otp} as first player`);
    }

    // Transition to the during-game segment
    return {
      ...G,
      currentSegment: "duringGame",
      currentPhase: "wakeUpPhase",
    };
  },

  turn: {
    phases: {
      // Phase 1: Choose first player
      chooseFirstPlayer: {
        start: true,
        next: "chooseChampions",

        endIf: ({ ctx }) => ctx.otp !== undefined,

        onBegin: ({ G }) => {
          logger.info("Phase: Choose First Player");
          return G;
        },

        moves: {
          chooseFirstPlayer: grandArchiveMoves.chooseFirstPlayer,
        },
      },

      // Phase 2: Choose champions and set domain identity
      chooseChampions: {
        next: "mulligan",

        endIf: ({ G, ctx }) => {
          // TODO: All players must have chosen their champions
          // Need CoreOperation method to check champion selection
          const players = ctx.playerOrder;
          return players.every((playerId) => {
            const player = ctx.players[playerId];
            return player; // && player.championLineage.length > 0;
          });
        },

        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();

          logger.info("Phase: Choose Champions");

          // Each player needs to select their starting champion
          const players = coreOps.getPlayers();
          coreOps.setPendingChampionSelection(players);

          return G;
        },

        moves: {
          chooseChampion: grandArchiveMoves.chooseChampion,
        },
      },

      // Phase 3: Mulligan phase
      mulligan: {
        endIf: ({ ctx }) => !ctx.pendingMulligan,

        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();

          logger.info("Phase: Mulligan");

          // Set up mulligan for all players
          coreOps.setPendingMulligan(coreOps.getPlayers());

          return G;
        },

        moves: {
          mulligan: grandArchiveMoves.mulligan,
          keepHand: grandArchiveMoves.keepHand,
        },
      },
    },
  },
};
