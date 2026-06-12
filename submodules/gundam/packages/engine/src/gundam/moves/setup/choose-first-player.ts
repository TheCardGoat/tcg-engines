/**
 * Choose First Player — Setup Move
 *
 * Responsibility: record the player decision only.
 *   - Set `turnPlayer` (who will be Player 1) and `activePlayer` (same — mulligans first).
 *   - Set `pendingDecision` with first player ahead.
 *
 * Automatic consequences (drawing hands, filling shields, placing tokens) are
 * handled by `onEnter` hooks on the flow phases — not here.
 *
 * Gated by the runtime's active-player check: the caller of
 * `initializeMatchState` is expected to pass `initialActivePlayer` set to
 * whoever won the rock-paper-scissors (rule 6-2-1-4), and only that player
 * may submit `chooseFirstPlayer`.
 */

import type { PlayerId } from "../../../types/branded.ts";
import type { GundamMoveDefinition } from "../../types.ts";
import { emitGundamLog } from "../../logging.ts";
import { rejectWithKey } from "../core/validation-error.ts";

export const chooseFirstPlayer: GundamMoveDefinition<"chooseFirstPlayer"> = {
  validate({ args, framework, validationMode }) {
    if (validationMode === "preflight") {
      return { valid: true };
    }

    const { playerId } = args;

    if (!framework.state.playerIds.includes(playerId as PlayerId)) {
      return rejectWithKey("gundam.error.setup.invalidPlayerId", { playerId }, "INVALID_PLAYER");
    }

    return { valid: true };
  },

  execute({ playerId: chooser, args, framework }) {
    const { playerId } = args;
    const firstPlayer = playerId as PlayerId;
    const pendingDecision = [
      firstPlayer,
      ...framework.state.playerIds.filter((id) => id !== firstPlayer),
    ] as PlayerId[];

    framework.status.patch({
      turnPlayer: firstPlayer,
      activePlayer: firstPlayer,
      pendingDecision,
    });

    emitGundamLog(framework, {
      type: "gundam.setup.firstPlayerChosen",
      values: { chooser, chosen: firstPlayer },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  },
};
