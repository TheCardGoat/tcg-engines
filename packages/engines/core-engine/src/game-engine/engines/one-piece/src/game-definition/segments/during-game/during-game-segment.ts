import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import { getCurrentTurnPlayer } from "~/game-engine/core-engine/state/context";
import { logger } from "~/game-engine/core-engine/utils/logger";
import { onePieceMoves } from "~/game-engine/engines/one-piece/src/moves/moves";
import type { OnePieceGameState } from "~/game-engine/engines/one-piece/src/one-piece-engine-types";

/**
 * During Game Segment for One Piece TCG
 *
 * Implements the main gameplay loop with the 5 turn phases:
 * 1. Refresh Phase - Set all rested cards to active, set all DON!! cards to active
 * 2. Draw Phase - Draw 1 card from deck
 * 3. DON!! Phase - Place up to 2 DON!! cards from DON!! deck to cost area
 * 4. Main Phase - Play cards, attack, activate abilities
 * 5. End Phase - End of turn cleanup
 */
export const duringGameSegment: SegmentConfig<OnePieceGameState> = {
  next: "endGame",

  onBegin: ({ G, coreOps }) => {
    logger.info("==== DURING GAME ====");
    return G;
  },

  endIf: ({ G }) => {
    return false;
  },

  onEnd: ({ G, coreOps }) => {
    logger.info("==== ENDING GAME ====");
    return G;
  },

  turn: {
    onBegin: ({ G, coreOps }) => {
      const ctx = coreOps.getCtx();
      const currentPlayer = getCurrentTurnPlayer(ctx);
      if (!currentPlayer) return G;

      // Check for deck-out defeat condition at start of turn
      const deckZone = coreOps.getZone("deck", currentPlayer);
      if (deckZone.cards.length === 0) {
        logger.info(
          `${currentPlayer} has no cards in deck - defeat by deck out`,
        );

        return G;
      }

      return G;
    },

    onEnd: ({ G, coreOps }) => {
      return G;
    },

    phases: {
      refreshPhase: {
        start: true,
        next: "drawPhase",

        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentPlayer = getCurrentTurnPlayer(ctx);
          if (!currentPlayer) return G;

          logger.info(`${currentPlayer} - Refresh Phase`);

          // TODO: Implement card state management when CoreEngine supports it
          // For now, refresh phase just logs the action
          // In full implementation, this would:
          // - Set all rested cards to active
          // - Set all DON!! cards in cost area to active

          return G;
        },

        endIf: () => true, // Automatic phase

        moves: {},
      },

      drawPhase: {
        next: "donPhase",

        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentPlayer = getCurrentTurnPlayer(ctx);
          if (!currentPlayer) return G;

          logger.info(`${currentPlayer} - Draw Phase`);

          // Draw 1 card from deck
          const deckZone = coreOps.getZone("deck", currentPlayer);
          if (deckZone.cards.length > 0) {
            coreOps.moveCard({
              playerId: currentPlayer,
              from: "deck",
              to: "hand",
              destination: "end",
            });
            logger.info(`${currentPlayer} drew 1 card`);
          } else {
            logger.info(`${currentPlayer} cannot draw - deck is empty`);
          }

          return G;
        },

        endIf: () => true, // Automatic phase

        moves: {},
      },

      donPhase: {
        next: "mainPhase",

        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentPlayer = getCurrentTurnPlayer(ctx);
          if (!currentPlayer) return G;

          logger.info(`${currentPlayer} - DON!! Phase`);
          return G;
        },

        endIf: ({ ctx }) => {
          // TODO: Implement proper phase ending mechanism
          // For now, DON!! phase ends automatically
          return true;
        },

        moves: {
          placeDon: onePieceMoves.placeDon,
          endPhase: onePieceMoves.endPhase,
        },
      },

      mainPhase: {
        next: "endPhase",

        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentPlayer = getCurrentTurnPlayer(ctx);
          if (!currentPlayer) return G;

          logger.info(`${currentPlayer} - Main Phase`);
          return G;
        },

        endIf: ({ ctx }) => {
          // TODO: Implement proper phase ending mechanism
          // For now, main phase ends automatically
          return true;
        },

        moves: {
          // Card play moves
          playCharacter: onePieceMoves.playCharacter,
          playStage: onePieceMoves.playStage,
          activateEvent: onePieceMoves.activateEvent,

          // DON!! management
          giveDon: onePieceMoves.giveDon,
          returnDon: onePieceMoves.returnDon,

          // Battle moves
          declareAttack: onePieceMoves.declareAttack,
          declareBlock: onePieceMoves.declareBlock,
          activateCounter: onePieceMoves.activateCounter,

          // Effect moves
          activateEffect: onePieceMoves.activateEffect,
          activateTrigger: onePieceMoves.activateTrigger,

          // Utility moves
          restCard: onePieceMoves.restCard,
          setActive: onePieceMoves.setActive,

          // End phase
          endPhase: onePieceMoves.endPhase,
        },
      },

      endPhase: {
        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentPlayer = getCurrentTurnPlayer(ctx);
          if (!currentPlayer) return G;

          logger.info(`${currentPlayer} - End Phase`);
          return G;
        },

        endIf: () => true, // Automatic phase unless hand size limit is exceeded

        moves: {
          discardCard: onePieceMoves.discardCard,
        },
      },
    },
  },
};
