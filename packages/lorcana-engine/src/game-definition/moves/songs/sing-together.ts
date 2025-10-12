import { createMove, type ZoneId } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";
import { and, cardInHand, isMainPhase } from "../../../validators";

/**
 * Sing Together Move (Legacy)
 *
 * Rule 10.10: Multiple characters exert to sing together
 *
 * Note: Prefer using playCard with "singTogether" cost parameter instead.
 * This move is kept for backward compatibility.
 *
 * Requirements:
 * - Song must be in hand
 * - All singers must be ready (not exerted)
 * - Combined ink values of singers must meet or exceed song cost
 */
export const singTogether = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "singTogether",
  LorcanaCardMeta
>({
  condition: and(isMainPhase(), (state, context) =>
    cardInHand(context.params.songId)(state, context),
  ),
  reducer: (draft, context) => {
    const { singersIds, songId } = context.params;
    const ops = useLorcanaOps(context);

    // Exert all singers
    for (const singerId of singersIds) {
      ops.exertCard(singerId);
    }

    // Play song to discard
    context.zones.moveCard({
      cardId: songId,
      targetZoneId: "discard" as ZoneId,
    });
  },
});
