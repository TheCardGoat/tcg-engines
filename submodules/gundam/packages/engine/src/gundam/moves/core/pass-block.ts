/**
 * Pass Block Move
 *
 * Used during the battle-phase block-step by the standby player to decline
 * declaring a blocker. Sets stage to "block-passed" which triggers block-step's
 * endIf, and the flow runner advances to action-step.
 *
 * Rules: 8-3 (Block Step) — choosing not to activate a <Blocker> effect is allowed (8-3-4)
 */

import type { GundamMoveDefinition } from "../../types.ts";
import { emitGundamLog } from "../../logging.ts";
import { rejectWithKey } from "./validation-error.ts";

export const passBlock: GundamMoveDefinition<"passBlock"> = {
  validate({ G, playerId, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };

    if (framework.state.status.phase !== "battle-phase") {
      return rejectWithKey("gundam.error.passBlock.notInBattlePhase", {}, "WRONG_PHASE");
    }

    if (framework.state.status.step !== "block-step") {
      return { valid: false, error: "Not in block step", errorCode: "WRONG_STEP" };
    }

    const g = G;
    const combat = g.turnMetadata.pendingCombat;
    if (!combat) {
      return { valid: false, error: "No pending combat", errorCode: "NO_PENDING_COMBAT" };
    }

    if (playerId === combat.attackerPlayerId) {
      return rejectWithKey("gundam.error.passBlock.attackerCannotPass", {}, "NOT_STANDBY_PLAYER");
    }

    return { valid: true };
  },

  execute({ G, playerId, framework }) {
    const g = G;
    if (g.turnMetadata.pendingCombat) {
      // Changing stage away from "block-step" lets block-step.endIf fire
      // so the flow advances into action-step, where action-step.onEnter
      // seeds activePlayer / pendingDecision for both players.
      g.turnMetadata.pendingCombat.stage = "block-passed";
    }

    emitGundamLog(framework, {
      type: "gundam.move.pass",
      values: { playerId, context: "block" },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  },
};
