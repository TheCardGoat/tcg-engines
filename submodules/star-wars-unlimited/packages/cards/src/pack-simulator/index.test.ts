import { describe, expect, it } from "vite-plus/test";
import { createSwuPackSimulator } from "./index.ts";
import { sets } from "../data/sets.ts";
import type { SwuCard } from "@tcg/star-wars-unlimited-types";

function makeCard(id: string, overrides: Partial<SwuCard> = {}): SwuCard {
  return {
    id,
    title: `Card ${id}`,
    internalName: `card-${id}`,
    setId: { set: "SOR", number: 1 },
    rarity: "common",
    cardType: "unit",
    types: ["unit"],
    unique: false,
    ...overrides,
  } as SwuCard;
}

const baseCards: SwuCard[] = [
  makeCard("leader-1", { cardType: "leader", types: ["leader"], rarity: "rare" }),
  makeCard("leader-2", { cardType: "leader", types: ["leader"], rarity: "rare" }),
  makeCard("base-1", { cardType: "base", types: ["base"], rarity: "common" }),
  makeCard("base-2", { cardType: "base", types: ["base"], rarity: "common" }),
  ...Array.from({ length: 20 }, (_, i) => makeCard(`common-${i}`, { rarity: "common" })),
  ...Array.from({ length: 10 }, (_, i) => makeCard(`uncommon-${i}`, { rarity: "uncommon" })),
  ...Array.from({ length: 5 }, (_, i) => makeCard(`rare-${i}`, { rarity: "rare" })),
  ...Array.from({ length: 2 }, (_, i) => makeCard(`legendary-${i}`, { rarity: "legendary" })),
];

describe("createSwuPackSimulator", () => {
  it("generates a pack with the correct structure", () => {
    const simulator = createSwuPackSimulator({ cards: baseCards, sets });
    const result = simulator.generatePack("sor", "test-seed");

    expect(result.slots).toHaveLength(16);
    expect(result.setId).toBe("sor");

    const counts = result.slots.reduce<Record<string, number>>((acc, slot) => {
      acc[slot.slotType] = (acc[slot.slotType] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts.leader).toBe(1);
    expect(counts.base).toBe(1);
    expect(counts.common).toBe(9);
    expect(counts.uncommon).toBe(3);
    expect(counts.rarePlus).toBe(1);
    expect(counts.foil).toBe(1);
  });

  it("is deterministic with the same seed", () => {
    const simulator = createSwuPackSimulator({ cards: baseCards, sets });
    const first = simulator.generatePack("sor", "seed-a");
    const second = simulator.generatePack("sor", "seed-a");

    expect(first.slots.map((s) => s.cardRef.id)).toEqual(second.slots.map((s) => s.cardRef.id));
  });

  it("falls back to the full pool when a slot pool is empty", () => {
    const simulator = createSwuPackSimulator({
      cards: [
        makeCard("leader-1", { cardType: "leader", types: ["leader"], rarity: "rare" }),
        makeCard("base-1", { cardType: "base", types: ["base"], rarity: "common" }),
        makeCard("unit-1", { rarity: "common" }),
      ],
      sets,
    });

    const result = simulator.generatePack("sor", "fallback");
    expect(result.slots).toHaveLength(16);
  });

  it("lists available sets from set definitions", () => {
    const simulator = createSwuPackSimulator({ cards: baseCards, sets });
    const available = simulator.getAvailableSets();

    expect(available.length).toBeGreaterThan(0);
    expect(available.some((set) => set.id === "sor")).toBe(true);
  });

  it("tags the foil slot as foil", () => {
    const simulator = createSwuPackSimulator({ cards: baseCards, sets });
    const result = simulator.generatePack("sor", "foil-check");
    const foilSlot = result.slots.find((slot) => slot.slotType === "foil");

    expect(foilSlot).toBeDefined();
    expect(foilSlot?.foil).toBe(true);
    expect(foilSlot?.variants).toContain("foil");
  });
});
