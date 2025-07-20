import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { LorcanaGameState } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";
import { lorcanaMoves } from "~/game-engine/engines/lorcana/src/moves/moves";

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

        endIf: ({ ctx }) => {
          // End when we've completed all steps (ready -> set -> draw)
          // After the draw step completes, currentStep becomes null
          return ctx.currentStep === null;
        },

        steps: {
          ready: {
            start: true,
            next: "set",

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              coreOps.readyAllCards(currentPlayer);
              coreOps.processTurnStartEffects();
              return G;
            },

            endIf: () => true, // Auto-advance
          },

          set: {
            next: "draw",

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              coreOps.clearDryingState(currentPlayer);
              coreOps.gainLoreFromLocations(currentPlayer);
              coreOps.processTurnStartTriggers();
              return G;
            },

            endIf: () => true, // Auto-advance
          },

          draw: {
            next: null, // End of beginning phase

            onBegin: ({ coreOps, G }) => {
              const currentPlayer = coreOps.getCurrentTurnPlayer();
              if (!coreOps.isFirstTurn()) {
                coreOps.drawCard(currentPlayer);
              }
              return G;
            },

            endIf: () => true, // Auto-advance
          },
        },
      },

      mainPhase: {
        next: "endOfTurnPhase",

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
        next: "beginningPhase", // Loop back for next turn

        onBegin: ({ coreOps, G }) => {
          coreOps.processEndOfTurnEffects();
          // Turn player was already advanced by the passTurn move

          return G;
        },

        endIf: () => true, // Auto-advance to next turn
      },
    },
  },
};
