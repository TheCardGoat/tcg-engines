import type { DefeatMove, LiveBoardCard } from "./board-types";

/** Center of each seat's Oblivion zone label, keyed by seat id. */
export type OblivionCenters = ReadonlyMap<string, { x: number; y: number }>;

/** A reported scene anchor rect (structurally the scene's CardAnchor). */
export type AnchorRect = { id: string; left: number; top: number; width: number; height: number };

/** A Clash card left the board for its controller's Oblivion: it was defeated.
 * Bounces (hand, deck) and cards that never stood on the board are skipped. */
export function detectDefeats(
  prevCards: ReadonlyMap<string, LiveBoardCard>,
  nextCards: readonly LiveBoardCard[],
  anchorById: ReadonlyMap<string, AnchorRect>,
  oblivionCenters: OblivionCenters,
  nextKey: () => number,
): DefeatMove[] {
  const next = new Map(nextCards.map((card) => [card.instanceId, card]));
  const defeats: DefeatMove[] = [];
  for (const [instanceId, card] of prevCards) {
    if (card.zone !== "clash") continue;
    const after = next.get(instanceId);
    if (after && after.zone !== "oblivion") continue;
    const anchor = anchorById.get(instanceId);
    if (!anchor) continue;
    const oblivion = oblivionCenters.get(card.controller);
    defeats.push({
      key: nextKey(),
      instanceId,
      fromX: anchor.left + anchor.width / 2,
      fromY: anchor.top + anchor.height / 2,
      fromWidth: anchor.width,
      fromHeight: anchor.height,
      toX: oblivion?.x ?? anchor.left + anchor.width / 2,
      toY: oblivion?.y ?? anchor.top,
      artUrl: card.imageUrl,
      name: card.name,
    });
  }
  return defeats;
}
