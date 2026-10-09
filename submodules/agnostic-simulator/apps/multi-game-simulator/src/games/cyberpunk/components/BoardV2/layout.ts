import { tabletopFanSlot } from "@tcg/simulator-presentation";
import { V2_SPENT_ANGLE } from "../../animation/v2-card-orientation";
import type { Side, SideZoneViews, ZoneCardView } from "../../engine";
import { CARD_BACK, LEGEND_CARD_BACK } from "../GameBoard/CardImage";
import type { PeekedLegends } from "../GameBoard/peekedLegends";

export type Rect = readonly [number, number, number, number];
export type CardLane = "hand" | "field" | "legendArea";
export interface PlacedCard {
  card: ZoneCardView;
  side: Side;
  rival: boolean;
  zone: string;
  lane: CardLane;
  rect: Rect;
  angle: number;
  stackIndex: number;
  zoneIndex: number;
  hidden: boolean;
  peeked: boolean;
  url: string;
  /** Field rows only: true when the row overlaps and this card's left edge
      (its ability-rail corner) is covered by the previous card. */
  overlapped?: boolean;
}
export type WorldCard = PlacedCard & { lane: "hand" | "field" };
export const TABLE_WIDTH = 1600;
export const TABLE_HEIGHT = 900;
export const HAND_HOVER_LIFT = 24;
export function tableSize() {
  return { width: TABLE_WIDTH, height: TABLE_HEIGHT };
}
export const PAGE_SIZE = { legendArea: 3 } as const;
const EMPTY_CARD_IDS: ReadonlySet<string> = new Set();
export type Pages = Record<CardLane, number>;
export const firstPages: Pages = { hand: 0, field: 0, legendArea: 0 };
export function boundedPage(page: number, count: number, size: number) {
  return Math.min(Math.max(0, page), Math.max(0, Math.ceil(count / size) - 1));
}
/** Field rows: clear of the rival hand backs, close to each other and to the
    local hand fan. Layout values sit ~55px lower than their screen position
    because the projection shifts field bands up (anchors.field). */
export const FIELD_ROW_Y = { rival: 179, local: 462 } as const;
/* Compact phones pull both rows toward the middle so the seats face each
   other across the table instead of hugging the edges. The rival row stays
   low enough to clear the tucked hand backs even at the deepest projection
   shift (Scene caps the compact shift near the -48 baseline). */
const COMPACT_RIVAL_FIELD_Y = 170;
const COMPACT_LOCAL_FIELD_Y = 430;
/** Keep each gear fan clear of the next band (the other row above, the hand below). */
const FIELD_ROW_MARGIN = 12;
const FIELD_FAN_STEP = 0.24;
const HAND_FAN_MARGIN = 8;
/** Hand fan silhouette: widest spread and the arc drop/tilt at the fan ends. */
export const HAND_FAN_SPAN = 870;
const HAND_FAN_DROP = 42;
const HAND_FAN_ROTATION = 11;
/** Hands never page, so the fan grows horizontally before it overlap-
    tightens. Ceilings dodge the instruments that share the hand bands: the
    local fan stops short of the pass plate and eddies status (right),
    while the rival backs spread nearly table-wide — the top rail holds
    nothing at their exposed-strip height. */
export const LOCAL_FAN_SPAN_MAX = 890;
export const RIVAL_FAN_SPAN_MAX = 1400;

/**
 * One field scale per seat, so each row reacts only to its own gear.
 *
 * Rows overlap-tighten horizontally instead of paging, so the scale only has
 * to bound the gear fan: a host's attachments drop 24% of the card height per
 * gear, and card + fan must stop short of the band below — the local field row
 * for the rival, the hand fan for the local seat. The allowance is capped at
 * one fan step: deeper fans may tuck behind the band below, but they never
 * keep shrinking the row, so card size stays stable through a match and
 * recovers as soon as the geared unit leaves.
 */
export function fieldRowScales(
  rows: readonly [readonly ZoneCardView[], readonly ZoneCardView[]],
  compact = false,
): [number, number] {
  const cardScale = compact ? 1.2 : 1;
  const cardHeight = 144 * cardScale * 1.4;
  const handWidth = 140 * cardScale;
  const rivalY = compact ? COMPACT_RIVAL_FIELD_Y : FIELD_ROW_Y.rival;
  const localY = compact ? COMPACT_LOCAL_FIELD_Y : FIELD_ROW_Y.local;
  const handTop = TABLE_HEIGHT - handWidth * 1.4 * 0.84;
  return rows.map((cards, index) => {
    const rival = index === 0;
    const gearDepth = Math.min(1, Math.max(0, ...cards.map((card) => card.attachedGear.length)));
    const bandBelow = rival
      ? localY - FIELD_ROW_MARGIN - rivalY
      : handTop - HAND_FAN_MARGIN - localY;
    return Math.min(1, bandBelow / (cardHeight * (1 + FIELD_FAN_STEP * gearDepth)));
  }) as [number, number];
}
/** Presentation only. The same landscape table scales to every viewport. */
export function placeSeat(
  zones: SideZoneViews,
  side: Side,
  rival: boolean,
  pages: Pages,
  revealedHandCardIds: ReadonlySet<string> = EMPTY_CARD_IDS,
  peekedLegends?: PeekedLegends,
  compact = false,
  // Each seat's field scale comes from fieldRowScales so a row only reacts to
  // its own gear fan; 0 keeps the per-seat estimate for direct callers (tests).
  fieldScale = 0,
): PlacedCard[] {
  // Compact phones trade row width for larger cards, and lift the rival field
  // above the wider local silhouette. Only the legend rack pages: fields and
  // hands overlap-tighten instead, so every card a seat controls stays on the
  // table.
  const cardScale = compact ? 1.2 : 1;
  return (["hand", "field", "legendArea"] as const).flatMap((lane) => {
    const cards = zones[lane];
    const size = lane === "legendArea" ? PAGE_SIZE.legendArea : cards.length;
    const start = boundedPage(pages[lane], cards.length, size) * size;
    const shown = cards.slice(start, start + size);
    const baseWidth = (lane === "legendArea" ? 100 : lane === "hand" ? 140 : 144) * cardScale;
    // Reserve the rotated silhouette, not just the unrotated card width.
    const footprints = shown.map(
      (card) => baseWidth * (card.spent && lane === "legendArea" ? 1.4 : 1),
    );
    // Field slots stay fixed when a card is spent; the gap contains its small tilt.
    const gap = lane === "legendArea" ? 8 : lane === "field" ? (compact ? 24 : 16) : 22;
    const total =
      footprints.reduce((sum, width) => sum + width, 0) + Math.max(0, shown.length - 1) * gap;
    // Field rows run between the Legend racks (inner edges ~x256/~x1344) and
    // clear of the corner instrument columns, so they use the full middle band.
    const available = lane === "legendArea" ? 352 : lane === "field" ? 1000 : 790;
    const gearDepth =
      lane === "field" ? Math.max(0, ...shown.map((card) => card.attachedGear.length)) : 0;
    const heightScale =
      lane === "field" ? 228 / (baseWidth * 1.4 * (1 + Math.min(1, gearDepth) * 0.24)) : 1;
    const scale =
      lane === "hand"
        ? 1
        : lane === "field" && fieldScale > 0
          ? fieldScale
          : lane === "field"
            ? Math.min(1, heightScale)
            : Math.min(1, available / total, heightScale);
    // Overlap-tighten like the hand fan: cards keep their size, the pitch
    // shrinks once the natural width+gap spacing would overflow the field span.
    // The band is size-independent, so the pitch is computed from the scaled
    // card width and never scaled again — smaller cards spread farther apart,
    // they do not drag the whole row inward with them.
    const scaledWidth = baseWidth * scale;
    const spacing =
      lane === "field"
        ? Math.min(scaledWidth + gap, (available - scaledWidth) / Math.max(1, shown.length - 1))
        : baseWidth + gap;
    return shown.map((card, index): PlacedCard => {
      const offset = index - (shown.length - 1) / 2;
      const width = baseWidth * scale;
      const height = width * 1.4;
      const before = footprints.slice(0, index).reduce((sum, value) => sum + value + gap, 0);
      const centre =
        lane === "field" ? offset * spacing : (before + footprints[index] / 2 - total / 2) * scale;
      let x = TABLE_WIDTH / 2 + centre - width / 2;
      let y: number = rival ? FIELD_ROW_Y.rival : FIELD_ROW_Y.local;
      if (compact && lane === "field") y = rival ? COMPACT_RIVAL_FIELD_Y : COMPACT_LOCAL_FIELD_Y;
      let angle = 0;
      if (lane === "field") {
        angle = card.spent ? V2_SPENT_ANGLE : 0;
      }
      if (lane === "hand") {
        // Overlapping fan instead of a shrinking row: cards keep their size and
        // spacing tightens as the hand grows, so a 10-card hand stays inside
        // the same arc that a 6-card draw shows. The fan first grows toward
        // the seat's span ceiling, so a 13-card hand spreads no tighter than
        // a small one before the deepest hands fall back to overlap.
        const span = Math.min(
          rival ? RIVAL_FAN_SPAN_MAX : LOCAL_FAN_SPAN_MAX,
          Math.max(HAND_FAN_SPAN, width * 0.72 * (shown.length - 1) + width),
        );
        const fan = tabletopFanSlot(
          index,
          shown.length,
          width,
          span,
          HAND_FAN_DROP,
          HAND_FAN_ROTATION,
        );
        x = TABLE_WIDTH / 2 - width / 2 + fan.x;
        y = rival ? -(height * 2) / 3 - fan.drop : TABLE_HEIGHT - height * 0.84 + fan.drop;
        angle = fan.angle * (rival ? -1 : 1);
      }
      if (lane === "legendArea") {
        // Corner rack coordinates: the visual position is CSS-driven (the
        // flat overlay's .legendRack rows), these keep the placed rect and
        // any fallback animation anchor pointing at the same corner —
        // Legends hug the table corner, below/beyond the resource strip.
        x = (rival ? 182 + centre : 1418 - centre) - width / 2;
        y = rival ? 12 : 628;
      }
      const peeked =
        lane === "legendArea" &&
        card.faceDown &&
        !card.identityHidden &&
        (card.revealed === true ||
          Boolean(
            peekedLegends?.ids.has(card.cardId) || peekedLegends?.indexes.has(start + index),
          ));
      const hidden =
        rival && lane === "hand"
          ? !revealedHandCardIds.has(card.cardId)
          : card.identityHidden || (card.faceDown && !card.revealed && !peeked && lane !== "hand");
      return {
        card,
        side,
        rival,
        lane,
        zoneIndex: start + index,
        zone: `${rival ? "opp" : "p"}-${lane}`,
        rect: [x, y, width, height],
        angle,
        stackIndex: index,
        hidden,
        peeked,
        overlapped:
          lane === "field" && spacing < scaledWidth + gap - 0.5 && index > 0 ? true : undefined,
        url: hidden ? (lane === "legendArea" ? LEGEND_CARD_BACK : CARD_BACK) : card.imageUrl,
      };
    });
  });
}

/** One compact instrument layout for both seats, in flat overlay units. */
const HUD_INSET = 24;
const HUD_GAP = 12;
const CONTROL_WIDTH = 280;
const PILE_WIDTH = 160;
const PILE_HEIGHT = 112;
const FIXER_HEIGHT = 56;
const ACTION_WIDTH = 328;
const ACTION_HEIGHT = (ACTION_WIDTH * 78) / 270;
const LOCAL_FIXER_Y = TABLE_HEIGHT - HUD_INSET - FIXER_HEIGHT;
const LOCAL_PILES_Y = LOCAL_FIXER_Y - 28 - PILE_HEIGHT;
/* The match-utilities cluster owns the board's top-right corner, so the rival
   instrument column starts below it. The cluster is fixed screen pixels while
   the world scales down on narrow windows, so callers convert its height into
   world units from the current table scale — a fixed inset would collide.
   `zoom` is the scale the Board shrinks the cluster to on small tables. */
export function rivalTopInset(scale: number, zoom = 1): number {
  // 10px edge inset + 44px plates + the "Sending action…" chip row below.
  return Math.ceil((85 * zoom) / Math.max(scale, 0.3)) + 8;
}
const RIVAL_TOP_INSET = rivalTopInset(1);

/* Compact phones redistribute each edge into one even column below the
   floating menu button: piles/identity, fixer, clock or action, then the
   seat's own gigs, legend and eddies (positioned in CSS). */
const COMPACT_INSET = 16;
const COMPACT_RIVAL_NAMEPLATE_Y = 100;
const COMPACT_LOCAL_FIXER_Y = TABLE_HEIGHT - COMPACT_INSET - FIXER_HEIGHT;
const COMPACT_LOCAL_NAMEPLATE_Y = COMPACT_LOCAL_FIXER_Y - 28 - PILE_HEIGHT;

export function fixerRect(
  rival: boolean,
  compact = false,
  rivalInset: number = RIVAL_TOP_INSET,
): Rect {
  if (compact)
    return [
      rival ? TABLE_WIDTH - COMPACT_INSET - CONTROL_WIDTH : COMPACT_INSET,
      rival ? 244 : COMPACT_LOCAL_FIXER_Y,
      CONTROL_WIDTH,
      FIXER_HEIGHT,
    ];
  return [
    rival ? TABLE_WIDTH - HUD_INSET - CONTROL_WIDTH : HUD_INSET,
    rival ? rivalInset + PILE_HEIGHT + 28 : LOCAL_FIXER_Y,
    CONTROL_WIDTH,
    FIXER_HEIGHT,
  ];
}

export function pilesRect(
  rival: boolean,
  compact = false,
  rivalInset: number = RIVAL_TOP_INSET,
): Rect {
  if (compact)
    return [
      rival ? TABLE_WIDTH - COMPACT_INSET - PILE_WIDTH : COMPACT_INSET,
      rival ? COMPACT_RIVAL_NAMEPLATE_Y : COMPACT_LOCAL_NAMEPLATE_Y,
      PILE_WIDTH,
      PILE_HEIGHT,
    ];
  return [
    rival ? TABLE_WIDTH - HUD_INSET - PILE_WIDTH : HUD_INSET,
    rival ? rivalInset : LOCAL_PILES_Y,
    PILE_WIDTH,
    PILE_HEIGHT,
  ];
}

export function identityRect(
  rival: boolean,
  compact = false,
  rivalInset: number = RIVAL_TOP_INSET,
): Rect {
  if (compact)
    return [
      rival ? TABLE_WIDTH - COMPACT_INSET - CONTROL_WIDTH : COMPACT_INSET + PILE_WIDTH + HUD_GAP,
      rival ? COMPACT_RIVAL_NAMEPLATE_Y : COMPACT_LOCAL_NAMEPLATE_Y,
      CONTROL_WIDTH - PILE_WIDTH - HUD_GAP,
      PILE_HEIGHT,
    ];
  return [
    rival ? TABLE_WIDTH - HUD_INSET - CONTROL_WIDTH : HUD_INSET + PILE_WIDTH + HUD_GAP,
    rival ? rivalInset : LOCAL_PILES_Y,
    CONTROL_WIDTH - PILE_WIDTH - HUD_GAP,
    PILE_HEIGHT,
  ];
}

export function actionRect(compact = false): Rect {
  if (compact)
    return [
      TABLE_WIDTH - COMPACT_INSET - ACTION_WIDTH,
      TABLE_HEIGHT - COMPACT_INSET - ACTION_HEIGHT,
      ACTION_WIDTH,
      ACTION_HEIGHT,
    ];
  return [
    TABLE_WIDTH - HUD_INSET - ACTION_WIDTH,
    TABLE_HEIGHT - HUD_INSET - ACTION_HEIGHT,
    ACTION_WIDTH,
    ACTION_HEIGHT,
  ];
}

export function clockRect(compact = false): Rect {
  if (compact) return [COMPACT_INSET, 340, CONTROL_WIDTH, 112];
  return [HUD_INSET, TABLE_HEIGHT / 2 - 56, CONTROL_WIDTH, 112];
}

/**
 * Fallback animation anchor strip over a hand lane, matching the fan's
 * reachable span in `placeSeat`. Only used when a hand slot has not mounted
 * (the arriving card's own node is preferred); the rival strip covers the
 * lower third of its tucked-away cards.
 */
export function handZoneRect(rival: boolean): Rect {
  const span = rival ? RIVAL_FAN_SPAN_MAX : LOCAL_FAN_SPAN_MAX;
  return [(TABLE_WIDTH - span) / 2, rival ? 0 : TABLE_HEIGHT - 140, span, 140];
}
