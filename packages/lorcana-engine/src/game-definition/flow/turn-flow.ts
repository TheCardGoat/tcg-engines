import type { FlowDefinition } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
} from "../../types/move-params";

/**
 * Lorcana Turn Flow
 *
 * Defines the sequence of game segments and phases:
 *
 * Game Segments:
 * 1. Starting a Game - Choose first player and mulligan
 * 2. Main Game - Normal gameplay with turns
 *
 * Turn Phases (Main Game):
 * 1. Beginning Phase - Start of turn, ready all cards
 * 2. Main Phase - Play cards, quest, challenge
 * 3. End Phase - End of turn cleanup
 *
 * The engine automatically handles phase transitions and turn management.
 */
export const lorcanaFlow: FlowDefinition<LorcanaGameState, LorcanaCardMeta> = {
  initialGameSegment: "startingAGame",
  gameSegments: {
    /**
     * Starting a Game Segment
     *
     * Rule 3.1: Starting a game
     * - Choose who goes first (Rule 3.1.1)
     * - Mulligan phase (Rule 3.1.6)
     */
    startingAGame: {
      order: 0,
      next: "mainGame",
      turn: {
        initialPhase: "chooseFirstPlayer",
        onBegin: (context) => {
          // Set currentPlayer to choosingFirstPlayer for priority
          // During startingAGame, there is no "turn player" yet
          // but there IS a priority player who can take actions
          const chooser = context.game.getChoosingFirstPlayer();
          if (chooser) {
            context.setCurrentPlayer(String(chooser));
          }
        },
        phases: {
          /**
           * Choose First Player Phase
           *
           * Rule 3.1.1: First player determined randomly
           * In practice, decided by players (rock-paper-scissors, dice roll, etc.)
           *
           * Manual transition: The move itself will call context.flow.endPhase()
           */
          chooseFirstPlayer: {
            order: 1,
            next: "mulligan",
            // Manual transition via move - always return false
            // The move itself calls context.flow.endPhase()
            endIf: (context) => context.game.getOTP() !== undefined,
            onEnd: (context) => {
              // After OTP is chosen, set currentPlayer to OTP for mulligan phase
              const otp = context.game.getOTP();
              if (otp) {
                context.setCurrentPlayer(String(otp));
              }
            },
          },

          /**
           * Mulligan Phase
           *
           * Rule 3.1.6: Players may mulligan by putting cards
           * on bottom of deck and redrawing
           */
          mulligan: {
            order: 2,
            next: undefined, // Transitions to mainGame segment
            onBegin: (context) => {
              // Priority starts with OTP for mulligan
              // Each player will mulligan in turn order
              const otp = context.game.getOTP();
              if (otp) {
                context.setCurrentPlayer(String(otp));
              }
            },
            // Advance when all players have completed mulligan
            // The move itself will call context.flow.endPhase()
            // So this always returns false to wait for manual transition
            endIf: (context) => {
              if (context.getCurrentPhase() === "mulligan") {
                return context.game.getPendingMulligan().length === 0;
              }

              return false;
            },
            // When this phase ends, transition to mainGame segment
            onEnd: (context) => {
              context.endGameSegment("startingAGame");
            },
          },
        },
      },
    },

    /**
     * Main Game Segment
     *
     * Normal gameplay with beginning, main, and end phases.
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
};
