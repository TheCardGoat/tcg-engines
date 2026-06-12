/**
 * Pass Action Step Move
 *
 * Used during the end-phase action-step (rules 9-1 through 9-5).
 * Players take turns starting with the standby player, choosing to
 * activate Action commands/effects or pass. When both players
 * consecutively pass (pendingDecision empties), the action step ends.
 *
 * Removes the current player from pendingDecision. If the array is
 * not empty, sets activePlayer to the next player in the list.
 */

import type { PlayerId } from "../../../types/branded.ts";
import type { GundamMoveDefinition } from "../../types.ts";
import { emitGundamLog } from "../../logging.ts";

export const passActionStep: GundamMoveDefinition<"passActionStep"> = {
  gatedByPendingEffects: true,

  validate({ playerId, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };

    const pending = framework.state.status.pendingDecision ?? [];
    if (!pending.includes(playerId as PlayerId)) {
      return {
        valid: false,
        error: "Player has already passed or is not pending",
        errorCode: "NOT_PENDING",
      };
    }
    return { valid: true };
  },

  execute({ playerId, framework }) {
    const pending = (framework.state.status.pendingDecision ?? []).filter(
      (id) => id !== (playerId as PlayerId),
    ) as PlayerId[];

    framework.status.patch({ pendingDecision: pending });

    if (pending.length > 0) {
      framework.status.patch({ activePlayer: pending[0] });
    }

    emitGundamLog(framework, {
      type: "gundam.move.pass",
      values: { playerId, context: "action-step" },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  },
};
