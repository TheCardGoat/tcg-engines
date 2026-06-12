/**
 * Pass Battle Action Move
 *
 * Used during the battle-phase action-step. Players take turns starting with
 * the standby player (8-4-1). When both pass (pendingDecision empties), the
 * action-step endIf triggers and the flow runner advances to damage-step.
 *
 * Rules: 8-4 (Action Step)
 */

import type { PlayerId } from "../../../types/branded.ts";
import type { GundamMoveDefinition } from "../../types.ts";
import { emitGundamLog } from "../../logging.ts";

export const passBattleAction: GundamMoveDefinition<"passBattleAction"> = {
  gatedByPendingEffects: true,

  validate({ playerId, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };

    if (framework.state.status.phase !== "battle-phase") {
      return { valid: false, error: "Not in battle phase", errorCode: "WRONG_PHASE" };
    }

    if (framework.state.status.step !== "action-step") {
      return { valid: false, error: "Not in action step", errorCode: "WRONG_STEP" };
    }

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

    if (pending.length > 0) {
      framework.status.patch({ pendingDecision: pending, activePlayer: pending[0] });
    } else {
      framework.status.patch({ pendingDecision: [] });
    }

    emitGundamLog(framework, {
      type: "gundam.move.pass",
      values: { playerId, context: "battle" },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  },
};
