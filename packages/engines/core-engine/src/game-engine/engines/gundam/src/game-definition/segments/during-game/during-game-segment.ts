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
            start: true,
            next: "start",
            onBegin: ({ G, coreOps }) => {
              // 7-2-3. Active Step
              // 7-2-3-1. The active player sets to active all rested cards placed in their battle area, resource area, and base section.
              // 7-2-3-2. All cards are set to active simultaneously during the active step, and in no particular order.
              const currentTurnPlayer = coreOps.getCurrentTurnPlayer();
              coreOps.readyAllCards(currentTurnPlayer);
              return G;
            },
            endIf: () => true, // Auto-advance
          },
          start: {
            // 7-2-4-1. Effects that specify “at the start of the turn” activate.
            // 7-2-5. After all of the steps listed above have been completed, the start phase ends and you move to the draw phase
            onBegin: ({ G, coreOps }) => {
              // TODO: add handler for "at the start of the turn" effects
              return G;
            },
            endIf: () => true, // Auto-advance
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
        endIf: () => true, // Auto-advance
      },

      resourcePhase: {
        next: "mainPhase",
        // 7-4-1. The active player places one Resource card from their resource deck into their resource area face up and active.
        moves: {
          playResource: gundamMoves.playResource,
        },
        onBegin: ({ G, coreOps }) => {
          const ctx = coreOps.getCtx();
          const currentTurnPlayer = getCurrentTurnPlayer(ctx);
          coreOps.addResourceToResourceArea(currentTurnPlayer);
          return G;
        },
        endIf: () => true, // Auto-advance
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
            start: true,
            next: "endStep",
            moves: {
              activateAction: gundamMoves.activateAction,
              playActionCommand: gundamMoves.playActionCommand,
              pass: gundamMoves.pass,
            },
          },
          endStep: {
            next: "handStep",
            onBegin: ({ G, coreOps }) => {
              // 7-6-4-1. Effects that specify “at the end of the turn” activate
              // TODO: add handler for "at the end of the turn" effects
              return G;
            },
            endIf: () => true, // Auto-advance
            // Activate "at the end of the turn" effects (Rule 7-6-4)
          },
          handStep: {
            next: "cleanupStep",
            endIf: ({ G, coreOps }) => {
              // 7-6-5-1. If the number of cards in your hand exceeds the upper limit of 10, discard cards of your choosing until you only have 10
              const ctx = coreOps.getCtx();
              const currentTurnPlayer = getCurrentTurnPlayer(ctx);
              return (
                coreOps.getCardsInZone("hand", currentTurnPlayer).length <= 10
              );
            },
            // Discard down to 10 cards if needed (Rule 7-6-5)
            moves: {
              discardToHandSize: gundamMoves.discardToHandSize,
            },
          },
          cleanupStep: {
            onBegin: ({ G, coreOps }) => {
              // 7-6-6-1. Effects with the duration limit “during this turn” lose effect. Resolve any triggered effects or the like which activate as a result.
              // TODO: add handler for "during this turn" effects
              return G;
            },
            // End "during this turn" effects (Rule 7-6-6)
          },
        },
      },
    },
  },
};
