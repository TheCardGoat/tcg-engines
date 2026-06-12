/**
 * Action Step — consecutive-pass reset (rule 9-4-1)
 *
 * When a player activates an Action command or Activate:Action ability
 * during the action-step, the consecutive-pass counter resets: both
 * players are re-added to pendingDecision and activePlayer rotates to
 * the next player in turn order (standby → active → standby …).
 */

import type { FrameworkWriteAPI } from "../../../types/move-types.ts";
import type { PlayerId } from "../../../types/branded.ts";

export function resetActionStepOnAction(playerId: string, framework: FrameworkWriteAPI): void {
  const playerIds = [...framework.state.playerIds] as string[];
  const currentIndex = playerIds.indexOf(playerId);
  const nextIndex = (currentIndex + 1) % playerIds.length;
  const nextPlayer = playerIds[nextIndex];

  framework.status.patch({
    pendingDecision: playerIds as PlayerId[],
    activePlayer: nextPlayer as PlayerId,
  });
}
