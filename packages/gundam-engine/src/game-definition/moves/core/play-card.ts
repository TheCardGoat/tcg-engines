import { createMove, type ZoneId } from "@tcg/core";
import { useGundamOps } from "../../../operations";
import type {
  GundamCardMeta,
  GundamGameState,
  GundamMoves,
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
 * 5-7. Play
 * 5-7-1. This typically describes revealing a card in your hand and paying its cost to use it.
 * 5-7-1-1. Sometimes cards are played from locations other than your hand due to effects.
 *
 * 7-5-2. Playing Cards from the Hand
 * 7-5-2-1. The active player may perform the following actions in any order as
 * many times as desired with cards from the hand by paying their cost:
 * deploy a Unit, deploy a Base, pair a Pilot, and activate a Command card with 【Main】 timing. (See 3. Card Types)
 * 7-5-2-2. When playing a card from the hand, follow the steps listed below.
 * 7-5-2-2-1. Reveal the card you wish to play from your hand.
 * 7-5-2-2-2. Confirm you have a sufficient number of Resources to fulfill its Lv. condition.
 * 7-5-2-2-3. Choose the number of Resources necessary to pay its cost and rest them.
 * 7-5-2-2-4. Play the card. (See 3. Card Types)
 *
 */
export const playCard = createMove<
  GundamGameState,
  GundamMoves,
  "playCard",
  GundamCardMeta
>({
  condition: and(
    isMainPhase(),
    (state, context) => cardInHand(context.params.cardId)(state, context),
    (state, context) =>
      cardOwnedByPlayer(context.params.cardId)(state, context),
  ),
  reducer: (draft, context) => {
    const { cardId } = context.params;
    const ops = useGundamOps(context);

    // Determine target zone (command go to trash, others to play)
    const cardType = ops.getCardType(cardId);
    const targetZone =
    const cardType = ops.getCardType(cardId);
    const targetZone = cardType === "COMMAND" ? "trash" : "battleArea";

    // Move card
    context.zones.moveCard({
      cardId,
      targetZoneId: targetZone,
    });
  },
});
