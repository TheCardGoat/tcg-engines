import type { FlowDefinition } from "@tcg/core";
import type { LorcanaGameState } from "../../types/move-params";

/**
 * Lorcana Turn Flow
 *
 * Defines the sequence of phases in a Lorcana turn:
 * 1. Beginning Phase - Start of turn, ready all cards
 * 2. Main Phase - Play cards, quest, challenge
 * 3. End Phase - End of turn cleanup
 *
 * The engine automatically handles phase transitions and turn management.
 */
export const lorcanaFlow: FlowDefinition<LorcanaGameState> = {
  gameSegments: {
    /**
     * Main Game Segment
     *
     * Lorcana is a simple game with only one segment - the main game.
     * More complex games could have additional segments like:
     * - setup: Initial game preparation
     * - draft: Card drafting phase
     * - sideboard: Between-game card swapping
     */
    mainGame: {
      order: 1,
      // No next segment - game ends when this segment ends
      turn: {
        initialPhase: "beginning",
        phases: {
          /**
           * Beginning Phase
           * - Ready all exhausted cards
           * - Draw a card (if not first turn)
           * - Automatically advances to Main phase
           */
          beginning: {
            order: 1,
            next: "main",
            onBegin: (_context) => {
              // Engine handles readying cards and drawing
            },
            endIf: () => true, // Auto-advance
          },

          /**
           * Main Phase
           * - Player can take actions (play cards, quest, challenge)
           * - Player manually ends phase by passing
           */
          main: {
            order: 2,
            next: "end",
            onBegin: (_context) => {
              // No automatic actions at start of main phase
            },
            // No endIf - player must manually pass to end phase
          },

          /**
           * End Phase
           * - Cleanup effects
           * - Automatically advances to next player's beginning phase
           */
          end: {
            order: 3,
            next: "beginning",
            onBegin: (_context) => {
              // Cleanup logic could go here
            },
            endIf: () => true, // Auto-advance to next turn
          },
        },
      },
    },
  },
  initialGameSegment: "mainGame",
};
