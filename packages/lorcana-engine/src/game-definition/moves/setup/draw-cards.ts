import { createMove, type ZoneId } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

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
  condition: (_state, context) => {
    // Not available during chooseFirstPlayer phase
    return context.flow?.currentPhase !== "chooseFirstPlayer";
  },
  reducer: (_draft, context) => {
    const { playerId, count } = context.params;

    context.zones.drawCards({
      from: "deck" as ZoneId,
      to: "hand" as ZoneId,
      count,
      playerId,
    });
  },
});
