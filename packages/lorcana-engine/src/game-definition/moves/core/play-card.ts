import { createMove, type ZoneId } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types";
import {
  and,
  cardInHand,
  cardOwnedByPlayer,
  isMainPhase,
} from "../../../validators";

/**
 * Play Card Move
 *
 * Rule 4.3.4: Pay cost and put card into play
 *
 * Handles multiple payment types:
 * - standard: Pay ink cost from inkwell
 * - shift: Banish target character
 * - sing: Exert singer character
 * - singTogether: Exert multiple singers
 * - free: No cost (effects/abilities)
 *
 * Characters enter play "drying" (exhausted) unless stated otherwise.
 * Actions go directly to discard after resolving.
 */
export const playCard = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "playCard",
  LorcanaCardMeta
>({
  condition: and(
    isMainPhase(),
    (state, context) => cardInHand(context.params.cardId)(state, context),
    (state, context) =>
      cardOwnedByPlayer(context.params.cardId)(state, context),
  ),
  reducer: (draft, context) => {
    const { cardId, cost } = context.params;
    const ops = useLorcanaOps(context);

    // Handle alternative costs
    if (cost === "shift") {
      // Shift: Banish target character
      const { shiftTarget } = context.params;
      context.zones.moveCard({
        cardId: shiftTarget,
        targetZoneId: "discard" as ZoneId,
      });
    } else if (cost === "sing") {
      // Sing: Exert singer
      const { singer } = context.params;
      ops.exertCard(singer);
    } else if (cost === "singTogether") {
      // Sing Together: Exert all singers
      const { singers } = context.params;
      for (const singer of singers) {
        ops.exertCard(singer);
      }
    }
    // "standard" and "free" costs don't require special handling here

    // Determine target zone (actions go to discard, others to play)
    const cardType = ops.getCardType(cardId);
    const targetZone =
      cardType === "action" ? ("discard" as ZoneId) : ("play" as ZoneId);

    // Move card
    context.zones.moveCard({
      cardId,
      targetZoneId: targetZone,
    });

    // Mark characters as drying
    if (cardType === "character") {
      ops.markAsDrying(cardId);
    }
  },
});
