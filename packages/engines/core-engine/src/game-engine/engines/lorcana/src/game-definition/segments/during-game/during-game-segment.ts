import type { LorcanaSegmentConfig } from "~/game-engine/engines/lorcana/src/game-definition/segments/types";
import { lorcanaMoves } from "~/game-engine/engines/lorcana/src/moves/moves";
import { logger } from "~/shared/logger";

export const duringGameSegment: LorcanaSegmentConfig = {
  next: "endGame",

  endIf: () => {
    return false;
  },

  turn: {
    moves: {
      "manualMoves-exertCard": lorcanaMoves.manualMoves.exertCard,
      resolveBag: lorcanaMoves.resolveBag,
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
              coreOps.gameStateCheck();

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
              coreOps.gameStateCheck();

              return G;
            },

            endIf: () => true, // Auto-advance
          },

          drawStep: {
            next: null, // End of beginning phase

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              if (!coreOps.isFirstTurn()) {
                coreOps.drawCard(currentPlayer, 1);
              }

              logger.log(">>>>>>>>> DRAW Phase");
              coreOps.gameStateCheck();

              return G;
            },

            endIf: () => true, // Auto-advance
          },
        },
      },

      mainPhase: {
        next: "endOfTurnPhase",

        // MainPhase doesn't auto-end - transitions are handled by moves calling FlowManager
        // endIf: undefined means the phase continues until explicitly ended

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
              resolveBag: lorcanaMoves.resolveBag,
            },
          },
          challenge: {
            moves: {},
          },
        },
      },

      endOfTurnPhase: {
        next: "beginningPhase",
        end: true,

        moves: {
          resolveBag: lorcanaMoves.resolveBag,
        },

        onBegin: ({ coreOps, G }) => {
          coreOps.addTriggeredEffectsToTheBag("endOfTurn");

          return G;
        },

        endIf: ({ G }) => G.bag.length === 0,
      },
    },
  },
};
