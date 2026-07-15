/**
 * Pass Turn Move
 *
 * Signals that the current player wants to end their turn.
 * Sets nextTurnPlayer, which triggers main-phase.endIf → end-phase,
 * and ultimately turn.endIf → advanceTurn() to cycle to the next turn.
 */

import type { GundamMoveDefinition } from "../../types.ts";
import type { PlayerId } from "../../../types/branded.ts";
import { emitGundamLog } from "../../logging.ts";

export const passTurn: GundamMoveDefinition<"passTurn"> = {
  gatedByPendingEffects: true,

  validate({ G, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };

    const g = G;

    if (g.turnMetadata.pendingCombat) {
      return {
        valid: false,
        error: "Must resolve pending combat before passing",
        errorCode: "PENDING_COMBAT",
      };
    }

    if (framework.state.status.phase === "battle-phase") {
      return {
        valid: false,
        error: "Cannot pass turn during battle",
        errorCode: "IN_BATTLE",
      };
    }

    return { valid: true };
  },

  execute({ playerId, framework }) {
    const playerIds = [...framework.state.playerIds] as string[];
    const currentIndex = playerIds.indexOf(playerId);
    if (currentIndex < 0) return;

    const nextIndex = (currentIndex + 1) % playerIds.length;
    const nextPlayer = playerIds[nextIndex];
    if (!nextPlayer) return;

    framework.status.patch({
      nextTurnPlayer: nextPlayer as PlayerId,
    });

    emitGundamLog(framework, {
      type: "gundam.move.pass",
      values: { playerId, context: "turn" },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  },
};
