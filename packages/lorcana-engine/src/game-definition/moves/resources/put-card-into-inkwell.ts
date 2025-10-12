import { createMove, type ZoneId } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";
import {
  and,
  cardInHand,
  cardOwnedByPlayer,
  hasNotUsedAction,
  isMainPhase,
} from "../../../validators";

/**
 * Put a Card Into The Inkwell
 *
 * Rule 4.3.3: Once per turn, put an inkable card into inkwell
 *
 * Conditions:
 * - Must be in Main phase
 * - Card must be in hand
 * - Card must be owned by current player
 * - Player hasn't inked this turn
 */
export const putACardIntoTheInkwell = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "putACardIntoTheInkwell",
  LorcanaCardMeta
>({
  condition: and(
    isMainPhase(),
    (state, context) => cardInHand(context.params.cardId)(state, context),
    (state, context) =>
      cardOwnedByPlayer(context.params.cardId)(state, context),
    hasNotUsedAction("hasInked"),
  ),
  reducer: (_draft, context) => {
    const { cardId } = context.params;

    // Move card to inkwell
    context.zones.moveCard({
      cardId,
      targetZoneId: "inkwell" as ZoneId,
    });

    // Mark action as used
    context.trackers?.mark("hasInked", context.playerId);
  },
});
