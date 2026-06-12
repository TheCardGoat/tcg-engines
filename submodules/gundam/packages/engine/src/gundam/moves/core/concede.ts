/**
 * Concede Move — ends the game immediately for the conceding player.
 */

import { emitGundamLog } from "../../logging.ts";
import type { GundamMoveDefinition } from "../../types.ts";

export const concede: GundamMoveDefinition<"concede"> = {
  ignoreActivePlayer: true,
  undoable: false,

  execute({ playerId, framework }) {
    const playerIds = framework.state.playerIds;
    const winner = playerIds.find((id) => id !== playerId);

    emitGundamLog(framework, {
      type: "gundam.move.concede",
      values: { playerId },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    framework.events.endGame({
      winner: winner,
      reason: `${playerId} conceded`,
    });
  },
};
