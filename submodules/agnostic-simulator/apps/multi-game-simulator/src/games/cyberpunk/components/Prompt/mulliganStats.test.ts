import { describe, expect, test } from "vite-plus/test";
import {
  computeMulliganStats,
  meetsMulliganKeepBar,
  type MulliganStatsCard,
} from "./mulliganStats";

function card(overrides: Partial<MulliganStatsCard> = {}): MulliganStatsCard {
  return {
    cost: 3,
    cardType: "unit",
    hasSellTag: false,
    faceDown: false,
    ...overrides,
  };
}

describe("computeMulliganStats", () => {
  test("bands costs into low (1–2), mid (3–5), and high (6+)", () => {
    const stats = computeMulliganStats([
      card({ cost: 1 }),
      card({ cost: 2 }),
      card({ cost: 3 }),
      card({ cost: 5 }),
      card({ cost: 6 }),
      card({ cost: 9 }),
    ]);
    expect(stats).toMatchObject({ lowCost: 2, midCost: 2, highCost: 2, counted: 6 });
  });

  test("counts units against gear and programs", () => {
    const stats = computeMulliganStats([
      card({ cardType: "unit" }),
      card({ cardType: "unit" }),
      card({ cardType: "gear" }),
      card({ cardType: "program" }),
    ]);
    expect(stats).toMatchObject({ units: 2, nonUnits: 2, counted: 4 });
  });

  test("counts sell-tag cards", () => {
    const stats = computeMulliganStats([card({ hasSellTag: true }), card()]);
    expect(stats.sellable).toBe(1);
  });

  test("excludes face-down cards from every count and reports them as hidden", () => {
    const stats = computeMulliganStats([
      card({ cost: 2, hasSellTag: true }),
      card({ faceDown: true, cost: 1, cardType: "unit", hasSellTag: true }),
    ]);
    expect(stats).toMatchObject({
      counted: 1,
      hidden: 1,
      lowCost: 1,
      units: 1,
      nonUnits: 0,
      sellable: 1,
    });
  });

  test("temporarily revealed face-down cards are counted", () => {
    const stats = computeMulliganStats([
      card({ faceDown: true, revealed: true, cost: 1, cardType: "unit" }),
    ]);
    expect(stats).toMatchObject({ counted: 1, hidden: 0, lowCost: 1, units: 1 });
  });

  test("visible cards without a printed cost fall into no band but stay counted", () => {
    const stats = computeMulliganStats([card({ cost: null })]);
    expect(stats).toMatchObject({ counted: 1, lowCost: 0, midCost: 0, highCost: 0, uncosted: 1 });
  });

  test("empty hand is all zeros", () => {
    expect(computeMulliganStats([])).toEqual({
      counted: 0,
      hidden: 0,
      lowCost: 0,
      midCost: 0,
      highCost: 0,
      uncosted: 0,
      units: 0,
      nonUnits: 0,
      sellable: 0,
    });
  });
});

describe("meetsMulliganKeepBar", () => {
  test("passes with the automation keep bar: 2 low-cost cards and 1 sellable", () => {
    const stats = computeMulliganStats([
      card({ cost: 2 }),
      card({ cost: 1 }),
      card({ hasSellTag: true }),
      card({ cost: 6 }),
    ]);
    expect(meetsMulliganKeepBar(stats)).toBe(true);
  });

  test("fails when the hand is cheap but has no sell ramp", () => {
    const stats = computeMulliganStats([card({ cost: 1 }), card({ cost: 2 })]);
    expect(meetsMulliganKeepBar(stats)).toBe(false);
  });

  test("fails when the hand is sellable but has no cheap plays", () => {
    const stats = computeMulliganStats([card({ cost: 4, hasSellTag: true })]);
    expect(meetsMulliganKeepBar(stats)).toBe(false);
  });
});
