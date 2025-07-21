import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { LorcanaGameState } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";
import { lorcanaMoves } from "~/game-engine/engines/lorcana/src/moves/moves";
import type { LorcanaCoreOperations } from "~/game-engine/engines/lorcana/src/operations/lorcana-core-operations";
import { logger } from "~/shared/logger";

export const duringGameSegment: SegmentConfig<LorcanaGameState> = {
  next: "endGame",

  endIf: () => {
    return false;
  },

  turn: {
    moves: {
      "manualMoves-exertCard": lorcanaMoves.manualMoves.exertCard,
    },

    phases: {
      beginningPhase: {
        start: true,
        next: "mainPhase",

        // No endIf condition - let steps control the flow naturally
        // When drawStep completes with next: null, the phase will end automatically

        steps: {
          readyStep: {
            start: true,
            next: "setStep",

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              coreOps.readyAllCards(currentPlayer);
              coreOps.processTurnStartEffects();

              logger.log(">>>>>>>>> Ready Phase");
              (coreOps as LorcanaCoreOperations).gameStateCheck();

              return G;
            },

            endIf: () => true, // Auto-advance
          },

          setStep: {
            next: "drawStep",

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              coreOps.clearDryingState(currentPlayer);
              coreOps.gainLoreFromLocations(currentPlayer);
              coreOps.processTurnStartTriggers();

              logger.log(">>>>>>>>> Set Phase");
              (coreOps as LorcanaCoreOperations).gameStateCheck();

              return G;
            },

            endIf: () => true, // Auto-advance
          },

          drawStep: {
            next: null, // End of beginning phase

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              if (!coreOps.isFirstTurn()) {
                coreOps.drawCard(currentPlayer);
              }

              logger.log(">>>>>>>>> DRAW Phase");
              (coreOps as LorcanaCoreOperations).gameStateCheck();

              return G;
            },

            endIf: () => true, // Auto-advance
          },
        },
      },

      mainPhase: {
        next: "endOfTurnPhase",

        endIf: ({ G, ctx }) => {
          // Only end mainPhase due to passTurn in duringGame segment
          // This prevents affecting starting game phases
          if (ctx.currentSegment !== "duringGame") {
            return false; // Never auto-end in starting game
          }
          // End mainPhase when passTurn flag is set
          // This flag is set by the passTurn move to trigger phase transition
          return G.passTurnRequested === true;
        },

        steps: {
          idle: {
            start: true,

            moves: {
              putACardIntoTheInkwell: lorcanaMoves.putACardIntoTheInkwell,
              passTurn: lorcanaMoves.passTurn,
              playCard: ({ G }) => {
                return G;
              },
              quest: ({ G }) => {
                return G;
              },
              challenge: ({ G }) => {
                return G;
              },
              moveCharacter: lorcanaMoves.moveCharacterToLocation,
              activateAbility: ({ G }) => {
                return G;
              },
            },
          },
          bag: {
            moves: {
              resolveBag: ({ G }) => {
                return G;
              },
            },
          },
          challenge: {
            moves: {},
          },
        },
      },

      endOfTurnPhase: {
        next: "beginningPhase",

        onBegin: ({ coreOps, G }) => {
          coreOps.processEndOfTurnEffects();

          // Clear the passTurn flag since we've transitioned out of mainPhase
          G.passTurnRequested = false;

          logger.log(">>>>>>>>> End of Turn Phase");
          logger.log("Proceeding to beginning phase");

          return G;
        },

        endIf: () => true,
      },
    },
  },
};
