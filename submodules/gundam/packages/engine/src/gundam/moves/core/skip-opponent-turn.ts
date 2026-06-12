import type { PlayerId } from "../../../types/branded.ts";
import type { GundamMoveDefinition } from "../../types.ts";

function getOpponent(playerIds: readonly PlayerId[], playerId: PlayerId): PlayerId | undefined {
  return playerIds.find((id) => String(id) !== String(playerId));
}

export const skipOpponentTurn: GundamMoveDefinition<"skipOpponentTurn"> = {
  ignoreActivePlayer: true,
  undoable: false,

  available({ playerId, framework }) {
    const opponent = getOpponent(framework.state.playerIds, playerId);
    if (!opponent) return false;
    const timeout = framework.time.getTimeoutStatus(opponent);
    const opponentTime = framework.time.getPlayerTime(opponent);
    return (
      timeout !== null &&
      !framework.time.isInNegativeTime(opponent) &&
      opponentTime.reserveMsRemaining > 0
    );
  },

  validate({ playerId, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };

    const opponent = getOpponent(framework.state.playerIds, playerId);
    if (!opponent) {
      return { valid: false, error: "No opponent found", errorCode: "INVALID_PLAYER" };
    }

    const timeout = framework.time.getTimeoutStatus(opponent);
    const opponentTime = framework.time.getPlayerTime(opponent);
    if (timeout === null) {
      return {
        valid: false,
        error: "Opponent has not timed out",
        errorCode: "OPPONENT_NOT_TIMED_OUT",
      };
    }
    if (framework.time.isInNegativeTime(opponent) || opponentTime.reserveMsRemaining <= 0) {
      return {
        valid: false,
        error: "Opponent is out of reserve time; drop is required",
        errorCode: "OPPONENT_DROP_REQUIRED",
      };
    }

    return { valid: true };
  },

  execute({ playerId, framework }) {
    const opponent = getOpponent(framework.state.playerIds, playerId);
    if (!opponent) return;

    const pending = framework.state.status.pendingDecision.filter(
      (id) => String(id) !== String(opponent),
    );
    framework.time.resetPlayerTimeAfterSkip(opponent);
    framework.status.patch({
      pendingDecision: pending as PlayerId[],
      activePlayer: (pending[0] ?? playerId) as PlayerId,
    });
  },
};
