import type { PlayerId } from "../../../types/branded.ts";
import type { GundamMoveDefinition } from "../../types.ts";

function getOpponent(playerIds: readonly PlayerId[], playerId: PlayerId): PlayerId | undefined {
  return playerIds.find((id) => String(id) !== String(playerId));
}

export const dropOpponent: GundamMoveDefinition<"dropOpponent"> = {
  ignoreActivePlayer: true,
  undoable: false,

  available({ playerId, framework }) {
    const opponent = getOpponent(framework.state.playerIds, playerId);
    if (!opponent) return false;
    const timeout = framework.time.getTimeoutStatus(opponent);
    const opponentTime = framework.time.getPlayerTime(opponent);
    return (
      framework.time.isInNegativeTime(opponent) ||
      opponentTime.reserveMsRemaining <= 0 ||
      timeout === "second"
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
    const canDrop =
      framework.time.isInNegativeTime(opponent) ||
      opponentTime.reserveMsRemaining <= 0 ||
      timeout === "second";

    if (!canDrop) {
      return {
        valid: false,
        error: "Opponent is not droppable on time",
        errorCode: "OPPONENT_NOT_DROPPABLE",
      };
    }

    return { valid: true };
  },

  execute({ playerId, framework }) {
    framework.events.endGame({
      winner: playerId,
      reason: `${playerId} won on time`,
    });
  },
};
