/**
 * Starting a Game segment for Alpha Clash
 *
 * Handles the pre-game setup including:
 * - Choosing first player
 * - Mulligan decisions
 * - Placing Contender cards
 * - Initial resource setup
 */

import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { AlphaClashGameState } from "../../../../alpha-clash-engine-types";
import { alphaClashMoves } from "../../../moves/moves";

export const startingAGameSegment: SegmentConfig<AlphaClashGameState> = {
  next: "duringGame",

  onBegin: ({ G, coreOps }) => {
    logger.info("==== STARTING ALPHA CLASH GAME ====");

    // Initialize game state
    const initializedState: AlphaClashGameState = {
      ...G,
      currentPhase: "startOfTurn",
      firstPlayerChosen: false,
    };

    // Setup each player
    for (const playerId of coreOps.getPlayers()) {
      logger.info(`Setting up player: ${playerId}`);

      // Find and place Contender card
      const allCards = coreOps.getZone("deck", playerId).cards;
      let contenderFound = false;

      // For simplicity, assume first card is the Contender (this would be validated during deck construction)
      if (allCards.length > 0) {
        const contenderInstanceId = allCards[0];

        // Move first card (assumed to be Contender) to Contender zone
        coreOps.moveCard({
          playerId,
          instanceId: contenderInstanceId,
          from: "deck",
          to: "contender",
          destination: "end",
        });

        logger.info(`${playerId} Contender moved to Contender zone`);
        contenderFound = true;
      }

      if (!contenderFound) {
        logger.error(`No Contender card found for player ${playerId}`);
      }

      // Shuffle remaining deck
      coreOps.shuffleZone("deck", playerId);

      // Draw initial hand (7 cards)
      const initialHandSize = 7;
      for (let i = 0; i < initialHandSize; i++) {
        coreOps.moveCard({
          playerId,
          from: "deck",
          to: "hand",
          destination: "end",
        });
      }

      logger.info(`${playerId} drew initial hand of ${initialHandSize} cards`);
    }

    return initializedState;
  },

  endIf: ({ ctx }) => {
    // End when first player is chosen and no pending mulligans
    return (
      ctx.otp !== undefined &&
      (!ctx.pendingMulligan || ctx.pendingMulligan.size === 0)
    );
  },

  onEnd: ({ G, ctx, coreOps }) => {
    logger.info("Starting game segment complete");

    // Set up for main game
    if (ctx.otp) {
      coreOps.setPriorityPlayer(ctx.otp);
      coreOps.setTurnPlayer(ctx.otp);

      logger.info(`Game starting with ${ctx.otp} as first player`);
    }

    return G;
  },

  turn: {
    phases: {
      chooseFirstPlayer: {
        start: true,
        next: "mulligan",

        endIf: ({ G }) => G.firstPlayerChosen === true,

        onBegin: ({ G }) => {
          logger.info("Choose first player phase");
          return G;
        },

        moves: {
          chooseFirstPlayer: alphaClashMoves.chooseFirstPlayer,
        },
      },

      mulligan: {
        endIf: ({ ctx }) =>
          !ctx.pendingMulligan || ctx.pendingMulligan.size === 0,

        onBegin: ({ G, ctx, coreOps }) => {
          logger.info(
            "Mulligan phase - players may mulligan their opening hands",
          );

          // Set all players as having pending mulligan
          coreOps.setPendingMulligan(coreOps.getPlayers());

          return G;
        },

        onEnd: ({ G }) => {
          logger.info("Mulligan phase complete");
          return G;
        },

        moves: {
          mulligan: alphaClashMoves.mulligan,
        },
      },
    },
  },
};
