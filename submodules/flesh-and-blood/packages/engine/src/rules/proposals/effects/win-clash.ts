import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent } from "../shared.ts";

/**
 * CR 8.5.45 "instead you win the clash" — stamp the controller as clash
 * winner via clash-win (reducer force-sets lastClashWinnerId).
 */
export function proposeWinClash(
  ctx: ProposalContext,
  effect: FabEffect & { type: "win-clash" },
): FabEffectProposalResult {
  void effect;
  const { state, layer, processId } = ctx;
  const playerId = layer.controllerId;
  // 1v1 product: the sole opposing seat is the clash loser.
  const opponentId = state.playerIds.find((id) => id !== playerId);
  if (!opponentId) return { supported: false, reason: "win-clash: no opposing hero" };
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "clash-win",
        affected: [],
        bindings: { "clash-result": "won", "clash-winner": playerId },
        data: { playerId, opponentId },
      },
    ],
  };
}
