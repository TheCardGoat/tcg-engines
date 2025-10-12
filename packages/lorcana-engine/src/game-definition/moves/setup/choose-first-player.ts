import { createMove, type PlayerId } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types";

/**
 * Choose Who Goes First Move
 *
 * Rule 3.1.1: First player determined randomly
 *
 * This move:
 * - Marks the chosen player as OTP (On The Play)
 * - Initializes pending mulligan list with all players
 *
 * The engine handles:
 * - Setting activePlayer
 * - Initializing turn counter
 * - Transitioning to first phase
 */
export const chooseWhoGoesFirstMove = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "chooseWhoGoesFirstMove",
  LorcanaCardMeta
>({
  reducer: (draft, context) => {
    const { playerId } = context.params;

    context.game.setOTP(playerId);

    // All players can mulligan after first player is chosen
    // Get all player IDs from the game state
    context.game.setPendingMulligan(
      Object.keys(draft.loreScores) as PlayerId[],
    );

    // Transition to mulligan phase
    if (context.flow) {
      context.flow.endPhase();
    }
  },
});
