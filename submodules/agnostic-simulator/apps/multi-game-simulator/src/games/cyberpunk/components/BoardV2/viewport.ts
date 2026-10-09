import { TABLE_HEIGHT, TABLE_WIDTH, type Rect, type PlacedCard } from "./layout";

export interface BoardProjection {
  transform: string;
  hudScale: number;
  anchors: ViewportAnchors;
}

/** Fit the play area, not the scenery. Bound card size on large desktop displays. */
export function boardViewport(width: number, height: number) {
  const aspect = Math.max(1, width) / Math.max(1, height);
  const worldHeight = Math.max(TABLE_HEIGHT, TABLE_WIDTH / aspect, height / 1.25);
  const pixelsPerUnit = Math.max(1, height) / worldHeight;
  return {
    worldHeight,
    // Small landscape screens need larger instrument lettering, not larger cards.
    hudScale: Math.min(1.5, Math.max(1, 0.68 / pixelsPerUnit)),
  };
}

export interface ViewportAnchors {
  x: number;
  top: number;
  bottom: number;
  field: number;
}
export const INITIAL_ANCHORS: ViewportAnchors = { x: 0, top: 0, bottom: 0, field: -48 };
export function anchoredRect(
  rect: Rect,
  horizontal: -1 | 0 | 1,
  vertical: -1 | 0 | 1,
  anchors: ViewportAnchors,
): Rect {
  return [
    rect[0] + horizontal * anchors.x,
    rect[1] + (vertical < 0 ? -anchors.top : vertical > 0 ? anchors.bottom : 0),
    rect[2],
    rect[3],
  ];
}
export function anchorCard(card: PlacedCard, anchors: ViewportAnchors): PlacedCard {
  if (card.lane === "field")
    return {
      ...card,
      rect: [card.rect[0], card.rect[1] + anchors.field, card.rect[2], card.rect[3]],
    };
  const horizontal = card.lane === "legendArea" ? (card.rival ? -1 : 1) : 0;
  const vertical = card.rival ? -1 : 1;
  return { ...card, rect: anchoredRect(card.rect, horizontal, vertical, anchors) };
}
