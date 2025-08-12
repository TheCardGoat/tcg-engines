import { getCurrentTurnPlayer } from "~/game-engine/core-engine";
import type { GundamSegmentConfig } from "~/game-engine/engines/gundam/src/game-definition/segments/types";
import { gundamMoves } from "~/game-engine/engines/gundam/src/moves/moves";

export const duringGameSegment: GundamSegmentConfig = {
  next: "endGame",

  endIf: ({ G }) => {
    return G.winner !== undefined;
  },

  turn: {
    phases: {
      startPhase: {
        start: true,
        next: "drawPhase",

        steps: {
          active: {
            // Set all cards to active (Rule 6-2-2)
          },
          start: {
            // Activate "at the start of the turn" effects (Rule 6-2-3)
          },
        },
      },

      drawPhase: {
        next: "resourcePhase",
        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentTurnPlayer = getCurrentTurnPlayer(ctx);
          coreOps.drawCard(currentTurnPlayer);
          return G;
        },
      },

      resourcePhase: {
        next: "mainPhase",

        // Play 1 resource (Rule 6-4-1)
        moves: {
          playResource: gundamMoves.playResource,
        },
      },

      mainPhase: {
        next: "endPhase",

        // Main phase actions (Rule 6-5)
        moves: {
          deployUnit: gundamMoves.deployUnit,
          deployBase: gundamMoves.deployBase,
          pairPilot: gundamMoves.pairPilot,
          playCommand: gundamMoves.playCommand,
          activateMain: gundamMoves.activateMain,
          attackWithUnit: gundamMoves.attackWithUnit,
          endMainPhase: gundamMoves.endMainPhase,
        },

        steps: {
          attack: {
            // Attack steps (Rule 7-2)
            onBegin: ({ G }) => G,
            onEnd: ({ G }) => G,
          },
        },
      },

      endPhase: {
        next: "startPhase",

        // End phase steps (Rule 7-6)
        steps: {
          actionStep: {
            moves: {
              activateAction: gundamMoves.activateAction,
              playActionCommand: gundamMoves.playActionCommand,
              pass: gundamMoves.pass,
            },
          },
          endStep: {
            // Activate "at the end of the turn" effects (Rule 7-6-4)
          },
          handStep: {
            // Discard down to 10 cards if needed (Rule 7-6-5)
            moves: {
              discardToHandSize: gundamMoves.discardToHandSize,
            },
          },
          cleanupStep: {
            // End "during this turn" effects (Rule 7-6-6)
          },
        },
      },
    },
  },
};
