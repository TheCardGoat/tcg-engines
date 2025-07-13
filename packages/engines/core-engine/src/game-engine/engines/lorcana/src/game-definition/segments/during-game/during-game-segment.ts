import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import type { LorcanaGameState } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";
import { lorcanaMoves } from "~/game-engine/engines/lorcana/src/moves/moves";

export const duringGameSegment: SegmentConfig<LorcanaGameState> = {
  next: "endGame",

  endIf: () => {
    return false;
  },

  turn: {
    phases: {
      beginningPhase: {
        start: true,
        next: "mainPhase",

        endIf: () => {
          return true;
        },

        steps: {
          ready: {},
          set: {},
          draw: {},
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
              moveCharacter: ({ G }) => {
                return G;
              },
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
      },
    },
  },
};
