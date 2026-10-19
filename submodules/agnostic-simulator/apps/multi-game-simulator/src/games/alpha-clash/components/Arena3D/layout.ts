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
  departing?: boolean;
}
export const CARD_RATIO = 5 / 7;
export const railCardHeight = 104;
/** Allocate one shared row from committed cards, never from the dragged preview. */
export function supportRails(board: LiveBoardState, seat: AcSeat, clashWidth: number) {
  const left = -380;
  const right = clashWidth / 2 + 190;
  const gutter = 24;
  const available = right - left - gutter;
  const minimum = Math.min(160, available / 3);
  const demand = (zone: string) =>
    Math.max(
      1,
      24 +
        board.cards
          .filter((card) => card.controller === seat && card.zone === zone)
          .reduce((width, card) => width + railCardHeight * (card.ready ? CARD_RATIO : 1) + 8, 0),
    );
  const accessories = demand("accessory");
  const resources = demand("resource");
  const accessoryWidth = Math.max(
    minimum,
    Math.min(available - minimum, (available * accessories) / (accessories + resources)),
  );
  const resourceLeft = left + accessoryWidth + gutter;
  return {
    accessory: { center: left + accessoryWidth / 2, width: accessoryWidth },
    resource: { center: (resourceLeft + right) / 2, width: right - resourceLeft },
  };
}
export const fieldCardHeight = (compact: boolean) => (compact ? 246 : 216);
// Inset field cards from the engraving, including their perspective lift above the table.
const fieldCardInset = 12;
/** World-space gaps scale with field card height; hands remain screen-space. */
export function arenaRows(compact: boolean, own: boolean) {
  const fieldHeight = fieldCardHeight(compact);
  // Compact health plates need clearance between the two contender holders.
  const seatOffset = own ? fieldHeight * (compact ? 0.22 : 0.13) : 0;
  const fieldCenter = fieldHeight * (compact ? 0.55 : 0.56) + seatOffset;
  const railHeight = compact ? 44 : railCardHeight + 8;
  const gap = fieldHeight * (own ? 0.12 : 0.06);
  const fieldEdge = fieldCenter + fieldHeight / 2;
  return {
    fieldCenter,
    seatOffset,
    railHeight,
    gap,
    railCenter: fieldEdge + gap + railHeight / 2,
    separator: fieldEdge + gap / 2,
  };
}
export function arenaHandPageSize(board: LiveBoardState) {
  return board.phaseName === "setup" || board.phaseName === "expansion" ? 8 : 7;
}
export function arenaLayout(
  board: LiveBoardState,
  viewer: AcSeat,
  compact: boolean,
  handPage: number,
  clashWidth: number,
  showPaymentResources = false,
): PlacedCard[] {
  const placed: PlacedCard[] = [];
  const rival: AcSeat = viewer === "player-one" ? "player-two" : "player-one";
  for (const seat of [viewer, rival]) {
    const sign = seat === viewer ? -1 : 1;
    const rails = supportRails(board, seat, clashWidth);
    const cards = (zone: string) =>
      board.cards.filter((c) => c.controller === seat && c.zone === zone);
    for (const zone of ["clash", "accessory", "resource", "contender", "clashground"]) {
      if (
        compact &&
        (zone === "accessory" ||
          (zone === "resource" && !(showPaymentResources && seat === viewer)))
      )
        continue;
      const row = cards(zone);
      const h = ["clash", "clashground"].includes(zone)
        ? fieldCardHeight(compact) - fieldCardInset * 2
        : zone === "contender"
          ? fieldCardHeight(compact)
          : railCardHeight;
      const rows = arenaRows(compact, seat === viewer);
      const y =
        sign *
        (zone === "clash" || zone === "clashground"
          ? rows.fieldCenter
          : zone === "contender"
            ? rows.fieldCenter
            : rows.railCenter);
      const widths = row.map(
        (card) =>
          (!card.ready && zone !== "contender" && zone !== "clashground" ? h : h * CARD_RATIO) +
          (zone === "resource" ? 8 : 16),
      );
      const total = widths.reduce((sum, w) => sum + w, 0);
      const rail = zone === "resource" || zone === "accessory";
      const available =
        zone === "resource"
          ? rails.resource.width - 16
          : zone === "accessory"
            ? rails.accessory.width - 16
            : clashWidth - fieldCardInset * 2;
      const gap = zone === "resource" ? 8 : 16;
      const fit =
        rail && row.length > 1
          ? Math.min(
              1,
              ...[widths[0], widths[widths.length - 1]].map(
                (edge) => (available - (edge - gap)) / Math.max(1, total - edge),
              ),
            )
          : Math.min(1, available / Math.max(1, total));
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
                  ? center + rails.accessory.center
                  : zone === "resource"
                    ? center + rails.resource.center
                    : center,
          y,
          z: 12 + i * 0.2,
          // Crowded rails overlap horizontally instead of reducing card height.
          height: rail ? h : h * fit,
          angle:
            (zone === "resource" ? Math.PI : 0) +
            (!card.ready && zone !== "contender" && zone !== "clashground" ? Math.PI / 2 : 0),
          hand: false,
        });
      });
    }
  }
  const standby = board.cards.filter((card) => card.zone === "standby");
  standby.forEach((card, i) =>
    placed.push({
      card,
      x: 420 + (i - (standby.length - 1) / 2) * 130,
      y: 0,
      z: 60 + i,
      height: 172,
      angle: 0,
      hand: false,
    }),
  );
  board.cards
    .filter((card) => card.controller === rival && card.zone === "hand")
    .slice(0, 8)
    .forEach((card, i) =>
      placed.push({
        card,
        x: 0,
        y: compact ? 393 : 458,
        z: 25 + i,
        height: 84,
        angle: 0,
        hand: true,
      }),
    );
  const pageSize = arenaHandPageSize(board);
  const hand = board.cards
    .filter((c) => c.controller === viewer && c.zone === "hand")
    .slice(handPage * pageSize, handPage * pageSize + pageSize);
  const visibleSlots = Math.max(1, Math.min(5, hand.length));
  const h = Math.min(
    compact ? 172 : 205,
    (clashWidth * 0.86 - 14 * (visibleSlots - 1)) / visibleSlots / CARD_RATIO,
  );
  const cardWidth = h * CARD_RATIO;
  // Centered over the open lower board, biased just left of the action controls.
  const handWidth = Math.max(cardWidth, clashWidth * 0.82);
  const handCenter = -clashWidth * 0.045;
  hand.forEach((card, i) => {
    const fan = tabletopFanSlot(i, hand.length, cardWidth, handWidth, 18, 5, 0.9);
    placed.push({
      card,
      x: handCenter + fan.x,
      y: (compact ? -425 : -470) - fan.drop,
      z: 85 + i * 1.5,
      height: h,
      angle: (-fan.angle * Math.PI) / 180,
      hand: true,
    });
  });
  return placed;
}
