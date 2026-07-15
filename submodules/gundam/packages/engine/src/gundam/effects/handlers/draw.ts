/**
 * Draw / Discard effect handlers
 */

import type { FrameworkWriteAPI } from "../../../types/move-types.ts";
import type { PlayerId } from "../../../types/branded.ts";
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
  endGameIfDeckEmpty(playerId, framework);
  return drawnIds;
}

/** Rule 1-2-2-2 / 11-2-1-2: a player with no cards in their deck loses immediately. */
export function endGameIfDeckEmpty(playerId: string, framework: FrameworkWriteAPI): boolean {
  if (framework.state.status.gameEnded) return true;
  if (framework.zones.getCards({ zone: "deck", playerId }).length > 0) return false;

  const opponentId = framework.state.playerIds.find((id) => String(id) !== playerId);
  emitGundamLog(framework, {
    type: "gundam.system.deckOut",
    values: { playerId: playerId as PlayerId },
    visibility: { mode: "PUBLIC" },
    category: "system",
  });
  framework.events.endGame({
    winner: opponentId,
    reason: `${playerId} ran out of cards`,
  });
  return true;
}

export function handleChosenDiscardAction(
  cardIds: readonly string[],
  playerId: string,
  framework: FrameworkWriteAPI,
): void {
  const hand = new Set(framework.zones.getCards({ zone: "hand", playerId }));
  const discarded = cardIds.filter((cardId) => hand.has(cardId));
  for (const cardId of discarded) {
    framework.zones.moveCard(cardId, { zone: "trash", playerId });
  }
  if (discarded.length > 0) {
    emitGundamLog(framework, {
      type: "gundam.effect.cardsDiscarded",
      values: { playerId, cardIds: discarded },
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
  const milled = framework.zones.mill(
    { zone: "deck", playerId },
    { zone: "trash", playerId },
    count,
  );
  endGameIfDeckEmpty(playerId, framework);
  return milled;
}
