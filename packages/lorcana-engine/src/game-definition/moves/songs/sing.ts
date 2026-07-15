import { type ZoneId, createMove } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";
import { and, cardInHand, cardInPlay, cardOwnedByPlayer, isMainPhase } from "../../../validators";

/**
 * Sing Move (Legacy)
 *
 * Rule 6.3.3: Exert character to play song for free
 *
 * Note: Prefer using playCard with "sing" cost parameter instead.
 * This move is kept for backward compatibility.
 *
 * Requirements:
 * - Song must be in hand
 * - Singer must be in play
 * - Singer must be owned by current player
 * - Singer must be able to sing (ready, not drying, meets cost requirement)
 */
export const sing = createMove<LorcanaGameState, LorcanaMoveParams, "sing", LorcanaCardMeta>({
  condition: and(
    isMainPhase(),
    (state, context) => cardInHand(context.params.songId)(state, context),
    (state, context) => cardInPlay(context.params.singerId)(state, context),
    (state, context) => cardOwnedByPlayer(context.params.singerId)(state, context),
  ),
  reducer: (draft, context) => {
    const { singerId, songId } = context.params;
    const ops = useLorcanaOps(context);

    // Exert singer
    ops.exertCard(singerId);

    // Play song to discard (actions go to discard)
    context.zones.moveCard({
      cardId: songId,
      targetZoneId: "discard" as ZoneId,
    });
  },
});
