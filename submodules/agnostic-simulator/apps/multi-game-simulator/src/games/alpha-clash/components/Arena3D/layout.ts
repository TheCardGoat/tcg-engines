import { tabletopFanSlot } from "@tcg/simulator-presentation";
import type { AcSeat, LiveBoardCard, LiveBoardState } from "../board-types";

export interface PlacedCard {
  card: LiveBoardCard;
  x: number;
  y: number;
  z: number;
  height: number;
  angle: number;
  rotationX?: number;
  hand: boolean;
}
export const CARD_RATIO = 5 / 7;
export function arenaHandPageSize(board: LiveBoardState) {
  return board.phaseName === "setup" || board.phaseName === "expansion" ? 8 : 7;
}
export function arenaLayout(
  board: LiveBoardState,
  viewer: AcSeat,
  compact: boolean,
  handPage: number,
  clashWidth: number,
): PlacedCard[] {
  const placed: PlacedCard[] = [];
  const rival: AcSeat = viewer === "player-one" ? "player-two" : "player-one";
  for (const seat of [viewer, rival]) {
    const sign = seat === viewer ? -1 : 1;
    const cards = (zone: string) =>
      board.cards.filter((c) => c.controller === seat && c.zone === zone);
    for (const zone of ["clash", "accessory", "resource", "contender", "clashground"]) {
      if (compact && (zone === "accessory" || zone === "resource")) continue;
      const row = cards(zone);
      const h =
        zone === "clash"
          ? compact
            ? 246
            : 214
          : zone === "contender"
            ? 216
            : zone === "clashground"
              ? 158
              : zone === "accessory"
                ? seat === viewer
                  ? 72
                  : 96
                : 72;
      const y =
        sign *
        (zone === "clash"
          ? compact
            ? 145
            : 132
          : zone === "contender"
            ? 140
            : zone === "clashground"
              ? 140
              : zone === "accessory"
                ? seat === viewer
                  ? 285
                  : 292
                : seat === viewer
                  ? 285
                  : 292);
      const widths = row.map(
        (card) =>
          (!card.ready && zone !== "contender" && zone !== "clashground" ? h : h * CARD_RATIO) +
          (zone === "resource" ? 8 : 16),
      );
      const total = widths.reduce((sum, w) => sum + w, 0);
      const fit = Math.min(
        1,
        (zone === "resource" ? 400 : zone === "accessory" ? 230 : clashWidth) / Math.max(1, total),
      );
      let cursor = (-total * fit) / 2;
      row.forEach((card, i) => {
        const center = cursor + (widths[i] * fit) / 2;
        cursor += widths[i] * fit;
        placed.push({
          card,
          x:
            zone === "contender"
              ? -730
              : zone === "clashground"
                ? 730
                : zone === "accessory"
                  ? center - 310
                  : zone === "resource"
                    ? center + 160
                    : center,
          y,
          z: 12 + i * 0.2,
          height: h * fit,
          angle:
            (zone === "resource" ? Math.PI : 0) +
            (!card.ready && zone !== "contender" && zone !== "clashground" ? Math.PI / 2 : 0),
          hand: false,
        });
      });
    }
  }
  const pageSize = arenaHandPageSize(board);
  const hand = board.cards
    .filter((c) => c.controller === viewer && c.zone === "hand")
    .slice(handPage * pageSize, handPage * pageSize + pageSize);
  const visibleSlots = Math.max(1, Math.min(5, hand.length));
  const h = Math.min(
    compact ? 178 : 225,
    (clashWidth * 0.9 - 14 * (visibleSlots - 1)) / visibleSlots / CARD_RATIO,
  );
  const cardWidth = h * CARD_RATIO;
  // Use the open lower board, reserving the right edge for action controls.
  // Keep a broad fan while preserving enough overlap to read it as one hand.
  const handWidth = Math.max(cardWidth, clashWidth * 0.9);
  hand.forEach((card, i) => {
    const fan = tabletopFanSlot(i, hand.length, cardWidth, handWidth, 22, 7, 0.92);
    placed.push({
      card,
      x: fan.x - 65,
      y: (compact ? -425 : -475) - fan.drop,
      z: 85 + i * 1.5,
      height: h,
      angle: (-fan.angle * Math.PI) / 180,
      hand: true,
    });
  });
  return placed;
}
