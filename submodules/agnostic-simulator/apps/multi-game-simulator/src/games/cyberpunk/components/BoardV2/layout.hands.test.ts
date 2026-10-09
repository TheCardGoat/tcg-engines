import { expect, test } from "vite-plus/test";
import type { SideZoneViews, ZoneCardView } from "../../engine";
import {
  fieldRowScales,
  firstPages,
  HAND_FAN_SPAN,
  LOCAL_FAN_SPAN_MAX,
  placeSeat,
  RIVAL_FAN_SPAN_MAX,
  TABLE_HEIGHT,
  TABLE_WIDTH,
} from "./layout";

function card(cardId: string, overrides: Partial<ZoneCardView> = {}): ZoneCardView {
  return {
    cardId,
    definitionId: `unit:${cardId}`,
    imageUrl: `/${cardId}.webp`,
    name: cardId,
    color: "blue",
    cardType: "unit",
    hasSellTag: false,
    rulesText: null,
    classifications: [],
    keywords: [],
    cost: null,
    effectiveCost: null,
    costEffects: [],
    power: null,
    effectivePower: null,
    activeEffects: [],
    spent: false,
    hasLag: false,
    identityHidden: false,
    faceDown: false,
    effectiveRules: [],
    attachedGear: [],
    ...overrides,
  };
}

function zones(hand: ZoneCardView[], field: ZoneCardView[] = []): SideZoneViews {
  return {
    hand,
    field,
    legendArea: [],
    trash: [],
    trashTop: null,
    fixerArea: [],
    gigArea: [],
    deckCount: 0,
    trashCount: 0,
    eddies: 0,
    spentEddies: 0,
    eddieCards: [],
    eddieCardCount: 0,
    soldThisTurn: false,
    streetCred: 0,
    gigCount: 0,
    activeEffects: [],
  };
}

const localHand = (n: number) => Array.from({ length: n }, (_, i) => card(`local_${i}`));
const rivalHand = (n: number) =>
  Array.from({ length: n }, (_, i) => card(`rival_${i}`, { identityHidden: true }));

for (const compact of [false, true]) {
  test(`hands keep a static, always-visible band (compact: ${compact})`, () => {
    const local = zones(localHand(compact ? 8 : 9));
    const rival = zones(rivalHand(7), [
      card("rival_unit"),
      card("rival_geared", {
        attachedGear: [card("gear_a"), card("gear_b"), card("gear_c")],
      }),
    ]);
    const pages = { ...firstPages };
    const [rivalFieldScale, localFieldScale] = fieldRowScales([rival.field, local.field], compact);

    const placed = [
      ...placeSeat(rival, "opponent", true, pages, undefined, undefined, compact, rivalFieldScale),
      ...placeSeat(local, "player", false, pages, undefined, undefined, compact, localFieldScale),
    ];
    const rivalHandCards = placed.filter((p) => p.lane === "hand" && p.rival);
    const localHandCards = placed.filter((p) => p.lane === "hand" && !p.rival);

    // Hands never go missing: every hand card the seat holds is placed.
    expect(rivalHandCards).toHaveLength(7);
    expect(localHandCards).toHaveLength(compact ? 8 : 9);

    // Static band: the fan is a fixed silhouette (arc varies per seat position
    // by design), so every tuck depth comes from the hand lane alone.
    const rivalBandTop = Math.min(...rivalHandCards.map((p) => p.rect[1]));
    const localBandTop = Math.min(...localHandCards.map((p) => p.rect[1]));
    expect(rivalBandTop).toBeLessThan(0);
    expect(localBandTop).toBeGreaterThan(0);

    // Visible no matter the camera: the rival backs keep a strip inside the
    // world (their bottoms sit below the top edge), the local hand keeps its
    // top above the bottom edge.
    for (const p of rivalHandCards) {
      expect(p.rect[1] + p.rect[3]).toBeGreaterThan(0);
    }
    for (const p of localHandCards) {
      expect(p.rect[1]).toBeLessThan(TABLE_HEIGHT);
    }

    // Hand placement is blind to the field: identical hands over an empty
    // field land on exactly the same rects.
    const emptyPlaced = [
      ...placeSeat(zones(rival.hand), "opponent", true, pages, undefined, undefined, compact),
      ...placeSeat(zones(local.hand), "player", false, pages, undefined, undefined, compact),
    ]
      .filter((p) => p.lane === "hand")
      .map((p) => ({ rect: p.rect, rival: p.rival, zoneIndex: p.zoneIndex }));
    const fullPlaced = [...rivalHandCards, ...localHandCards].map((p) => ({
      rect: p.rect,
      rival: p.rival,
      zoneIndex: p.zoneIndex,
    }));
    expect(fullPlaced).toEqual(emptyPlaced);
  });
}

test("hands never page: a 16-card rival hand spreads wide with every back visible", () => {
  const placed = placeSeat(zones(rivalHand(16)), "opponent", true, { ...firstPages }).filter(
    (p) => p.lane === "hand",
  );
  expect(placed).toHaveLength(16);
  const left = Math.min(...placed.map((p) => p.rect[0]));
  const right = Math.max(...placed.map((p) => p.rect[0] + p.rect[2]));
  const baseLeft = (TABLE_WIDTH - HAND_FAN_SPAN) / 2;
  const ceilingLeft = (TABLE_WIDTH - RIVAL_FAN_SPAN_MAX) / 2;
  // The fan grew horizontally past the base silhouette but stays inside its
  // ceiling, and every back keeps a strip below the top edge.
  expect(left).toBeLessThan(baseLeft);
  expect(right).toBeGreaterThan(baseLeft + HAND_FAN_SPAN);
  expect(left).toBeGreaterThanOrEqual(ceilingLeft);
  expect(right).toBeLessThanOrEqual(ceilingLeft + RIVAL_FAN_SPAN_MAX);
  for (const p of placed) {
    expect(p.rect[1] + p.rect[3]).toBeGreaterThan(0);
  }
});

test("a crowded local hand stays on the table inside the local ceiling", () => {
  const placed = placeSeat(zones(localHand(14)), "player", false, { ...firstPages }).filter(
    (p) => p.lane === "hand",
  );
  expect(placed).toHaveLength(14);
  const right = Math.max(...placed.map((p) => p.rect[0] + p.rect[2]));
  // The fan never crosses the ceiling that clears the pass plate (right) and
  // the eddies status (left), and every card keeps its top above the bottom
  // edge.
  expect(right).toBeLessThanOrEqual((TABLE_WIDTH + LOCAL_FAN_SPAN_MAX) / 2);
  for (const p of placed) {
    expect(p.rect[1]).toBeLessThan(TABLE_HEIGHT);
  }
});
