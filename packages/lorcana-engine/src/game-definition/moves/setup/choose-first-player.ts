import { type ConditionFailure, createMove, type PlayerId } from "@tcg/core";
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
 *
 * Validation:
 * - Player ID must be valid (exists in game)
 * - OTP must not be already set (can't choose twice)
 * - Must be in chooseFirstPlayer phase
 */
export const chooseWhoGoesFirstMove = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "chooseWhoGoesFirstMove",
  LorcanaCardMeta
>({
  condition: (state, context): true | ConditionFailure => {
    const { playerId } = context.params;

    // 1. Check we're in the correct phase (most fundamental constraint)
    if (context.flow?.currentPhase !== "chooseFirstPlayer") {
      return {
        reason: `Cannot choose first player during ${context.flow?.currentPhase || "unknown"} phase. Must be in chooseFirstPlayer phase.`,
        errorCode: "WRONG_PHASE",
        context: {
          currentPhase: context.flow?.currentPhase,
          requiredPhase: "chooseFirstPlayer",
        },
      };
    }

    // 2. Check that the executing player is the one designated to choose
    // Rule 3.1.2: One player is randomly determined to choose who is the starting player
    const choosingPlayer = context.game.getChoosingFirstPlayer();
    if (choosingPlayer && context.playerId !== choosingPlayer) {
      return {
        reason: `Only ${String(choosingPlayer)} can choose the first player. You are ${String(context.playerId)}.`,
        errorCode: "NOT_CHOOSING_PLAYER",
        context: {
          choosingPlayer: String(choosingPlayer),
          executingPlayer: String(context.playerId),
        },
      };
    }

    // 3. Check OTP hasn't been set yet (prevent choosing twice)
    const currentOTP = context.game.getOTP();
    if (currentOTP) {
      return {
        reason: "First player has already been chosen",
        errorCode: "FIRST_PLAYER_ALREADY_CHOSEN",
        context: {
          currentOTP: String(currentOTP),
        },
      };
    }

    // 4. Validate player exists in the game
    const validPlayers = Object.keys(state.external.loreScores) as PlayerId[];
    if (!validPlayers.includes(playerId)) {
      return {
        reason: `Invalid player ID: ${playerId}. Valid players: ${validPlayers.join(", ")}`,
        errorCode: "INVALID_PLAYER_ID",
        context: {
          playerId: String(playerId),
          validPlayers: validPlayers.map((p) => String(p)),
        },
      };
    }

    return true;
  },

  reducer: (draft, context) => {
    const { playerId } = context.params;

    context.game.setOTP(playerId);

    // All players can mulligan after first player is chosen
    // Get all player IDs from the game state
    context.game.setPendingMulligan(
      Object.keys(draft.external.loreScores) as PlayerId[],
    );

    if (context.flow) {
      context.flow.endPhase("chooseFirstPlayer");
    }
  },
});
