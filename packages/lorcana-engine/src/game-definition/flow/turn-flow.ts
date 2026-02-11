import { type FlowDefinition, createPlayerId } from "@tcg/core";
import type { LorcanaCardMeta, LorcanaGameState } from "../../types";

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
  gameSegments: {
    /**
     * Starting a Game Segment
     *
     * Rule 3.1: Starting a game
     * - Choose who goes first (Rule 3.1.1)
     * - Mulligan phase (Rule 3.1.6)
     */
    startingAGame: {
      next: "mainGame",
      order: 0,
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
        onBegin: (context) => {
          // Switch to next player at start of each turn
          // In a 2-player game, alternate between players
          const currentPlayer = context.getCurrentPlayer();
          const otp = context.game.getOTP();

          if (currentPlayer && otp) {
            // Alternate players (assumes 2-player game)
            // TODO: Support N-player games with proper turn order
            const playerIds = [String(otp)];
            // Get the other player (not OTP)
            // This is a simplification for 2-player games
            // In production, you'd have a player list to iterate through
            const otpStr = String(otp);

            // For now, just toggle between two players based on turn number
            // If turn is odd, OTP plays; if even, other player plays
            const turnNum = context.getTurnNumber();
            // This assumes OTP is player_one - needs improvement for robustness
            context.setCurrentPlayer(
              turnNum % 2 === 1 ? otpStr : (otpStr === "player_one" ? "player_two" : "player_one"),
            );
          } else {
            // First turn - set to OTP
            if (otp) {
              context.setCurrentPlayer(String(otp));
            }
          }
        },
        phases: {
          /**
           * Beginning Phase
           * - Ready all exhausted cards
           * - Draw a card (if not first turn)
           * - Automatically advances to Main phase
           */
          beginning: {
            endIf: () => true,
            next: "main",
            onBegin: (context) => {
              // Ready all cards for the current player
              const currentPlayer = context.getCurrentPlayer();
              if (!currentPlayer) return;

              // Get all cards owned by current player
              const playZone = context.zones.getCardsInZone(
                "play" as any,
                createPlayerId(currentPlayer),
              );

              // Ready each card (clear exerted status and summoning sickness)
              for (const cardId of playZone) {
                const meta = context.cards.getCardMeta(cardId);
                if (meta) {
                  context.cards.updateCardMeta(cardId, {
                    state: "ready",
                    isDrying: false, // Clear summoning sickness
                  });
                }
              }

              // TODO: Draw a card (if not first turn)
              // This requires checking if it's turn 1 and drawing from deck
            },
            order: 1, // Auto-advance
          },

          /**
           * Main Phase
           * - Player can take actions (play cards, quest, challenge)
           * - Player manually ends phase by passing
           */
          main: {
            next: "end",
            onBegin: (_context) => {
              // No automatic actions at start of main phase
            },
            order: 2,
            // No endIf - player must manually pass to end phase
          },

          /**
           * End Phase
           * - Cleanup effects
           * - Automatically advances to next turn (no next phase defined)
           */
          end: {
            order: 3,
            // No 'next' defined - FlowManager will call transitionToNextTurn()
            onBegin: (_context) => {
              // Cleanup logic could go here
            },
            endIf: () => true, // Auto-advance to next turn
          },
        },
      },
    },
  },
  initialGameSegment: "startingAGame",
};
