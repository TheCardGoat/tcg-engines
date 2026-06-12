/**
 * Draw / Discard effect handlers
 */

import type { FrameworkWriteAPI } from "../../../types/move-types.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { TargetFilter } from "@tcg/gundam-types";
import type { TargetResolutionContext } from "../../../runtime/target-dsl.ts";
import { evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { emitGundamLog } from "../../logging.ts";

export function handleDrawAction(
  count: number,
  playerId: string,
  framework: FrameworkWriteAPI,
): string[] {
  const drawnIds = framework.zones.drawCards({
    from: { zone: "deck", playerId },
    to: { zone: "hand", playerId },
    count,
  });
  if (drawnIds.length > 0) {
    // Public count, private cardIds — opponent sees how many cards were
    // drawn but not which ones. Emit a PUBLIC summary plus a PRIVATE
    // detail entry so the drawer's UI can recover the exact identities.
    emitGundamLog(framework, {
      type: "gundam.effect.cardsDrawn",
      values: { playerId, count: drawnIds.length },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
    emitGundamLog(framework, {
      type: "gundam.effect.cardsDrawn",
      values: { playerId, count: drawnIds.length, cardIds: drawnIds },
      visibility: { mode: "PRIVATE", visibleTo: [playerId as PlayerId] },
      category: "action",
    });
  }
  return drawnIds;
}

export function handleDiscardAction(
  count: number,
  playerId: string,
  framework: FrameworkWriteAPI,
  filter?: TargetFilter,
  targetContext?: TargetResolutionContext,
): void {
  // Discard from top of hand (random-discard for opponents without a pending choice)
  const handCards = framework.zones.getCards({ zone: "hand", playerId });
  const eligibleCards =
    filter && targetContext
      ? evaluateTargetFilter(
          { ...filter, owner: "friendly", zone: "hand" },
          targetContext.getCardsInZone(playerId as PlayerId, "hand"),
          targetContext,
        )
      : handCards;
  const toDiscard = eligibleCards.slice(0, count);
  for (const cardId of toDiscard) {
    framework.zones.moveCard(cardId, { zone: "trash", playerId });
  }
  if (toDiscard.length > 0) {
    emitGundamLog(framework, {
      type: "gundam.effect.cardsDiscarded",
      values: { playerId, cardIds: toDiscard },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  }
}

/**
 * Mill: place the top N cards of `playerId`'s deck into their trash.
 *
 * Clamps `count` to the deck size so a short/empty deck no-ops gracefully
 * (see Freeden GD02-127 【Destroyed】 — mill 2 even if the deck only has 1).
 * Discard / draw-style actions don't emit events in this codebase; mill
 * mirrors that and stays silent.
 */
export function handleMillDeckAction(
  count: number,
  playerId: string,
  framework: FrameworkWriteAPI,
): string[] {
  const deckCards = framework.zones.getCards({ zone: "deck", playerId });
  const toMill = deckCards.slice(0, count);
  for (const cardId of toMill) {
    framework.zones.moveCard(cardId, { zone: "trash", playerId });
  }
  return toMill;
}
