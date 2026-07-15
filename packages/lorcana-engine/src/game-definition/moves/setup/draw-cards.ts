import { type ZoneId, createMove } from "@tcg/core";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";

/**
 * Draw Cards Move
 *
 * Utility move for drawing cards from deck to hand.
 * Used by:
 * - Beginning phase (draw for turn)
 * - Card effects that draw cards
 * - Testing/debugging
 */
export const drawCards = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "drawCards",
  LorcanaCardMeta
>({
  condition: (_state, context) => context.flow?.currentPhase !== "chooseFirstPlayer",
  reducer: (_draft, context) => {
    const { playerId, count } = context.params;

    context.zones.drawCards({
      count,
      from: "deck" as ZoneId,
      playerId,
      to: "hand" as ZoneId,
    });
  },
});
