import { describe, expect, it } from "vite-plus/test";
import type { CardDefinition, CardColor } from "@tcg/cyberpunk-types";
import { validateDeck } from "../src/deck-validation.ts";

function makeLegend({
  name,
  slug,
  color,
  ram,
  displayName,
  ...rest
}: Partial<CardDefinition> & {
  name: string;
  slug?: string;
  color?: CardColor;
  ram?: number;
}): CardDefinition {
  return {
    id: name,
    externalId: `cyberpunk:${slug ?? name}`,
    slug: slug ?? name,
    name,
    displayName: displayName ?? name,
    color: color ?? "green",
    classifications: [],
    set: { code: "alpha", name: "Alpha" },
    printNumber: "001",
    printings: [],
    artist: "",
    imageUrl: "",
    sourceImageUrl: "",
    rarity: null,
    legality: "legal",
    hasSellTag: false,
    type: "legend",
    ram: ram ?? 2,
    timingTriggers: [],
    keywords: [],
    cost: null,
    power: null,
    ...rest,
  } as CardDefinition;
}

function makeCard({
  name,
  slug,
  color,
  ram,
  displayName,
  ...rest
}: Partial<CardDefinition> & {
  name: string;
  slug?: string;
  color?: CardColor;
  ram?: number;
}): CardDefinition {
  return {
    id: name,
    externalId: `cyberpunk:${slug ?? name}`,
    slug: slug ?? name,
    name,
    displayName: displayName ?? name,
    color: color ?? "green",
    classifications: [],
    set: { code: "alpha", name: "Alpha" },
    printNumber: "001",
    printings: [],
    artist: "",
    imageUrl: "",
    sourceImageUrl: "",
    rarity: null,
    legality: "legal",
    hasSellTag: false,
    type: "unit",
    ram: ram ?? 1,
    timingTriggers: [],
    keywords: [],
    cost: 1,
    power: 1,
    ...rest,
  } as CardDefinition;
}

function makeMainDeck(
  count: number,
  base?: Partial<Parameters<typeof makeCard>[0]>,
): CardDefinition[] {
  return Array.from({ length: count }, (_, i) =>
    makeCard({ name: `Card ${i}`, slug: `card-${i}`, ...base }),
  );
}

const defaultLegends = [
  makeLegend({ name: "Legend A", slug: "legend-a", color: "green", ram: 2 }),
  makeLegend({ name: "Legend B", slug: "legend-b", color: "green", ram: 2 }),
  makeLegend({ name: "Legend C", slug: "legend-c", color: "red", ram: 2 }),
];

describe("validateDeck", () => {
  it("returns no errors for a valid deck", () => {
    const mainDeck = makeMainDeck(40, { color: "green", ram: 1 });
    expect(validateDeck(defaultLegends, mainDeck)).toEqual([]);
  });

  // ── Legend count ──────────────────────────────────────────────────

  describe("legend count", () => {
    it("errors when fewer than 3 legends", () => {
      const legends = defaultLegends.slice(0, 2);
      const errors = validateDeck(legends, makeMainDeck(40, { color: "green", ram: 1 }));
      expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_LEGEND_COUNT" }));
    });

    it("errors when more than 3 legends", () => {
      const legends = [...defaultLegends, makeLegend({ name: "Legend D", slug: "legend-d" })];
      const errors = validateDeck(legends, makeMainDeck(40, { color: "green", ram: 1 }));
      expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_LEGEND_COUNT" }));
    });
  });

  // ── Legend type ───────────────────────────────────────────────────

  describe("legend type", () => {
    it("errors when a non-legend card is in legends", () => {
      const legends = [
        defaultLegends[0],
        defaultLegends[1],
        makeCard({ name: "Not A Legend", slug: "not-legend", type: "unit" }),
      ];
      const errors = validateDeck(legends, makeMainDeck(40, { color: "green", ram: 1 }));
      expect(errors).toContainEqual(expect.objectContaining({ code: "NON_LEGEND_IN_LEGENDS" }));
    });
  });

  // ── Unique legend names ──────────────────────────────────────────

  describe("unique legend names", () => {
    it("errors when two legends share the same name", () => {
      const legends = [
        makeLegend({ name: "V", slug: "v-corpo", color: "green", ram: 2 }),
        makeLegend({ name: "V", slug: "v-nomad", color: "green", ram: 2 }),
        makeLegend({ name: "Goro", slug: "goro", color: "green", ram: 2 }),
      ];
      const errors = validateDeck(legends, makeMainDeck(40, { color: "green", ram: 1 }));
      expect(errors).toContainEqual(expect.objectContaining({ code: "DUPLICATE_LEGEND_NAME" }));
    });
  });

  // ── Deck size ────────────────────────────────────────────────────

  describe("main deck size", () => {
    it("errors when fewer than 40 cards", () => {
      const errors = validateDeck(defaultLegends, makeMainDeck(39, { color: "green", ram: 1 }));
      expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_DECK_SIZE" }));
    });

    it("errors when more than 50 cards", () => {
      const errors = validateDeck(defaultLegends, makeMainDeck(51, { color: "green", ram: 1 }));
      expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_DECK_SIZE" }));
    });

    it("accepts 40 cards", () => {
      const errors = validateDeck(defaultLegends, makeMainDeck(40, { color: "green", ram: 1 }));
      expect(errors.filter((e) => e.code === "INVALID_DECK_SIZE")).toHaveLength(0);
    });

    it("accepts 50 cards", () => {
      const errors = validateDeck(defaultLegends, makeMainDeck(50, { color: "green", ram: 1 }));
      expect(errors.filter((e) => e.code === "INVALID_DECK_SIZE")).toHaveLength(0);
    });
  });

  // ── No legends in main deck ──────────────────────────────────────

  describe("legends in main deck", () => {
    it("errors when a legend is in the main deck", () => {
      const mainDeck = [
        ...makeMainDeck(39, { color: "green", ram: 1 }),
        makeLegend({ name: "Stray Legend", slug: "stray-legend" }),
      ];
      const errors = validateDeck(defaultLegends, mainDeck);
      expect(errors).toContainEqual(expect.objectContaining({ code: "LEGEND_IN_MAIN_DECK" }));
    });
  });

  // ── Copy limit ───────────────────────────────────────────────────

  describe("copy limit", () => {
    it("allows up to 3 copies of the same card", () => {
      const mainDeck = [
        ...Array.from({ length: 3 }, () =>
          makeCard({ name: "Jackie", slug: "jackie", color: "green", ram: 1 }),
        ),
        ...makeMainDeck(37, { color: "green", ram: 1 }),
      ];
      const errors = validateDeck(defaultLegends, mainDeck);
      expect(errors.filter((e) => e.code === "EXCEEDS_COPY_LIMIT")).toHaveLength(0);
    });

    it("errors when more than 3 copies of the same card", () => {
      const mainDeck = [
        ...Array.from({ length: 4 }, () =>
          makeCard({ name: "Jackie", slug: "jackie", color: "green", ram: 1 }),
        ),
        ...makeMainDeck(36, { color: "green", ram: 1 }),
      ];
      const errors = validateDeck(defaultLegends, mainDeck);
      expect(errors).toContainEqual(expect.objectContaining({ code: "EXCEEDS_COPY_LIMIT" }));
    });
  });

  // ── RAM limits ───────────────────────────────────────────────────

  describe("RAM limits", () => {
    it("allows cards within the RAM budget", () => {
      const legends = [
        makeLegend({ name: "A", slug: "a", color: "green", ram: 2 }),
        makeLegend({ name: "B", slug: "b", color: "green", ram: 2 }),
        makeLegend({ name: "C", slug: "c", color: "red", ram: 3 }),
      ];
      const mainDeck = [
        ...makeMainDeck(20, { color: "green", ram: 4 }),
        ...(makeMainDeck(20, { color: "red", ram: 3 }).map((c, i) => ({
          ...c,
          slug: `red-card-${i}`,
          name: `Red Card ${i}`,
        })) as CardDefinition[]),
      ];
      const errors = validateDeck(legends, mainDeck);
      expect(errors.filter((e) => e.code === "EXCEEDS_RAM_LIMIT")).toHaveLength(0);
    });

    it("errors when a card exceeds its color RAM budget", () => {
      const legends = [
        makeLegend({ name: "A", slug: "a", color: "green", ram: 2 }),
        makeLegend({ name: "B", slug: "b", color: "green", ram: 1 }),
        makeLegend({ name: "C", slug: "c", color: "red", ram: 2 }),
      ];
      const mainDeck = [
        ...makeMainDeck(39, { color: "green", ram: 1 }),
        makeCard({ name: "Big Green", slug: "big-green", color: "green", ram: 4 }),
      ];
      const errors = validateDeck(legends, mainDeck);
      expect(errors).toContainEqual(expect.objectContaining({ code: "EXCEEDS_RAM_LIMIT" }));
    });

    it("errors when a card color has no legend providing RAM", () => {
      const mainDeck = [
        ...makeMainDeck(39, { color: "green", ram: 1 }),
        makeCard({ name: "Blue Card", slug: "blue-card", color: "blue", ram: 1 }),
      ];
      const errors = validateDeck(defaultLegends, mainDeck);
      expect(errors).toContainEqual(expect.objectContaining({ code: "EXCEEDS_RAM_LIMIT" }));
    });

    it("sums RAM across multiple legends of the same color", () => {
      const legends = [
        makeLegend({ name: "A", slug: "a", color: "green", ram: 2 }),
        makeLegend({ name: "B", slug: "b", color: "green", ram: 2 }),
        makeLegend({ name: "C", slug: "c", color: "green", ram: 1 }),
      ];
      const mainDeck = makeMainDeck(40, { color: "green", ram: 5 });
      const errors = validateDeck(legends, mainDeck);
      expect(errors.filter((e) => e.code === "EXCEEDS_RAM_LIMIT")).toHaveLength(0);
    });
  });

  // ── Multiple errors ──────────────────────────────────────────────

  it("returns multiple errors at once", () => {
    const legends = [
      makeLegend({ name: "A", slug: "a", color: "green", ram: 1 }),
      makeLegend({ name: "A", slug: "a2", color: "green", ram: 1 }),
    ];
    const mainDeck = makeMainDeck(30, { color: "blue", ram: 1 });
    const errors = validateDeck(legends, mainDeck);
    const codes = errors.map((e) => e.code);
    expect(codes).toContain("INVALID_LEGEND_COUNT");
    expect(codes).toContain("DUPLICATE_LEGEND_NAME");
    expect(codes).toContain("INVALID_DECK_SIZE");
    expect(codes).toContain("EXCEEDS_RAM_LIMIT");
  });
});
