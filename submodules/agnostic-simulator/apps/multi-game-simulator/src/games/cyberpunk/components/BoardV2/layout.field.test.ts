import { expect, test } from "vite-plus/test";
import type { SideZoneViews, ZoneCardView } from "../../engine";
import { fieldRowScales, firstPages, placeSeat, TABLE_WIDTH } from "./layout";

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

function zones(field: ZoneCardView[]): SideZoneViews {
  return {
    hand: [],
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

const units = (n: number, overrides: Partial<ZoneCardView> = {}) =>
  Array.from({ length: n }, (_, i) => card(`unit_${i}`, overrides));

function place(
  field: ZoneCardView[],
  rival = false,
  compact = false,
  fieldScale = 0,
): ReturnType<typeof placeSeat> {
  return placeSeat(
    zones(field),
    rival ? "opponent" : "player",
    rival,
    { ...firstPages },
    undefined,
    undefined,
    compact,
    fieldScale,
  );
}

const fieldOf = (placed: ReturnType<typeof placeSeat>) => placed.filter((p) => p.lane === "field");

test("five or fewer units keep the fixed-slot row", () => {
  const placed = fieldOf(place(units(4)));
  expect(placed).toHaveLength(4);
  // Natural spacing (144px card + 16px gap) centred on the table.
  expect(placed.map((p) => p.rect[0])).toEqual([488, 648, 808, 968]);
  for (const p of placed) {
    expect(p.rect[1]).toBe(462);
    expect(p.rect[2]).toBe(144);
    expect(p.overlapped).toBeUndefined();
  }
});

test("five units still fit without overlap", () => {
  const placed = fieldOf(place(units(5)));
  const pitches = placed.slice(1).map((p, i) => p.rect[0] - placed[i].rect[0]);
  for (const pitch of pitches) expect(pitch).toBeCloseTo(160, 6);
});

test("rows past five overlap-tighten instead of paging", () => {
  const placed = fieldOf(place(units(8)));
  expect(placed).toHaveLength(8);
  // Every unit stays inside the field band (500px half-width around centre).
  const span = TABLE_WIDTH / 2 - 500;
  for (const p of placed) {
    expect(p.rect[0]).toBeGreaterThanOrEqual(span - 0.5);
    expect(p.rect[0] + p.rect[2]).toBeLessThanOrEqual(TABLE_WIDTH - span + 0.5);
  }
  // Cards keep their size; the pitch does the shrinking.
  const pitches = placed.slice(1).map((p, i) => p.rect[0] - placed[i].rect[0]);
  for (const pitch of pitches) {
    expect(pitch).toBeCloseTo((1000 - 144) / 7, 6);
    expect(pitch).toBeLessThan(144);
  }
  // The leftmost Unit stays fully visible; the rest have their left edge
  // covered, so their edge badges must flip to the visible side.
  expect(placed[0]!.overlapped).toBeUndefined();
  for (const p of placed.slice(1)) expect(p.overlapped).toBe(true);
});

test("even a dozen units all stay on the table", () => {
  const placed = fieldOf(place(units(12)));
  expect(placed).toHaveLength(12);
  const first = placed[0]!;
  const last = placed[placed.length - 1]!;
  expect(first.rect[0]).toBeGreaterThanOrEqual(TABLE_WIDTH / 2 - 500 - 0.5);
  expect(last.rect[0] + last.rect[2]).toBeLessThanOrEqual(TABLE_WIDTH / 2 + 500 + 0.5);
  expect(placed.map((p) => p.zoneIndex)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

test("spent units keep their slot in an overlapped row", () => {
  const plain = fieldOf(place(units(6)));
  const spent = fieldOf(place(units(6, { spent: true })));
  expect(spent.map((p) => p.rect[0])).toEqual(plain.map((p) => p.rect[0]));
  expect(spent[2]!.angle).not.toBe(0);
  expect(plain[2]!.angle).toBe(0);
});

test("no-gear rows past five keep full-size cards", () => {
  expect(fieldRowScales([units(8), units(6)], false)).toEqual([1, 1]);
});

test("gear shrinks only its own row and only by one capped step", () => {
  const geared = units(7);
  geared[5] = card("geared_unit", {
    attachedGear: [card("gear_a"), card("gear_b"), card("gear_c")],
  });
  // Compact: the one-fan-step allowance binds (desktop bands fit it at full
  // size, so gear never shrinks a desktop row).
  const [rivalScale, localScale] = fieldRowScales([geared, units(2)], true);
  expect(rivalScale).toBeLessThan(1);
  expect(localScale).toBe(1);
  // The allowance is capped at one step: deeper stacks shrink no further.
  const deeper = [...geared];
  deeper[0] = card("deep_unit", { attachedGear: [card("d1"), card("d2")] });
  expect(fieldRowScales([deeper, units(2)], true)[0]).toBe(rivalScale);
  // And the shrink follows the geared seat: the un-geared row stays full size.
  const [flippedRival, flippedLocal] = fieldRowScales([units(2), geared], true);
  expect(flippedRival).toBe(1);
  expect(flippedLocal).toBeLessThan(1);
  expect(fieldRowScales([geared, units(2)], false)).toEqual([1, 1]);
  const rivalRow = fieldOf(place(geared, true, true, rivalScale));
  const localRow = fieldOf(place(units(2), false, true, localScale));
  expect(rivalRow[0]!.rect[2]).toBeLessThan(localRow[0]!.rect[2]);
  expect(localRow[0]!.rect[2]).toBeCloseTo(172.8, 6);
});

test("compact rows sit pulled together: rival at 170, local at 430", () => {
  const rival = fieldOf(place(units(3), true, true));
  const local = fieldOf(place(units(3), false, true));
  for (const p of rival) expect(p.rect[1]).toBe(170);
  for (const p of local) expect(p.rect[1]).toBe(430);
  // Desktop keeps its authored bands.
  for (const p of fieldOf(place(units(3), false, false))) expect(p.rect[1]).toBe(462);
});

test("compact five-unit rows keep their natural spacing in the wider band", () => {
  const field = units(5);
  const [scale] = fieldRowScales([field], true);
  expect(scale).toBe(1);
  const placed = fieldOf(place(field, false, true, scale));
  // 1.2× cards: the 1000px band fits five compact cards + gaps without overlap.
  expect(placed[0]!.rect[2]).toBeCloseTo(172.8, 6);
  const pitches = placed.slice(1).map((p, i) => p.rect[0] - placed[i].rect[0]);
  for (const pitch of pitches) expect(pitch).toBeCloseTo(172.8 + 24, 6);
  const rival = fieldOf(place(units(3), true, true, scale));
  for (const p of rival) expect(p.rect[1]).toBe(170);
});

test("a shrunk row spreads across the whole band instead of dragging its pitch in", () => {
  const placed = fieldOf(place(units(12), false, true, 0.75));
  const width = placed[0]!.rect[2];
  expect(width).toBeCloseTo(172.8 * 0.75, 6);
  // The pitch is computed from the scaled card width against the full
  // size-independent band, then used as-is — never scaled a second time.
  const pitches = placed.slice(1).map((p, i) => p.rect[0] - placed[i].rect[0]);
  for (const pitch of pitches) expect(pitch).toBeCloseTo((1000 - width) / 11, 3);
  // Smaller cards still own the whole field band.
  expect(placed[0]!.rect[0]).toBeCloseTo(TABLE_WIDTH / 2 - 500, 3);
  expect(placed[11]!.rect[0] + placed[11]!.rect[2]).toBeCloseTo(TABLE_WIDTH / 2 + 500, 3);
  expect(placed[0]!.rect[1]).toBe(430);
});
