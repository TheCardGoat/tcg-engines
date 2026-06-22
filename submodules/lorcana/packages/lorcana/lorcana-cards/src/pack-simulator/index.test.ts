import { describe, expect, it } from "bun:test";
import type { LorcanaCard } from "@tcg/lorcana-types";
import { createLorcanaPackSimulator } from "./index";
import { LORCANA_INK_TYPES, LORCANA_RARITIES } from "./constants";

const baseI18n = {
  en: { name: "Test" },
  de: { name: "Test" },
  fr: { name: "Test" },
  it: { name: "Test" },
} as const;

function makeCard(
  id: string,
  overrides: Partial<LorcanaCard> & {
    inkType: LorcanaCard["inkType"];
    rarity: NonNullable<LorcanaCard["rarity"]>;
    set: string;
  },
): LorcanaCard {
  return {
    id,
    canonicalId: `ci_${id}`,
    name: `Card ${id}`,
    fullName: `Card ${id}`,
    cost: 1,
    inkable: true,
    cardType: "character",
    strength: 1,
    willpower: 1,
    lore: 1,
    cardNumber: 1,
    i18n: baseI18n,
    ...overrides,
  } as LorcanaCard;
}

function makeSet(id: string, name: string) {
  return {
    id,
    name,
    code: id,
    sortNumber: Number.parseInt(id.replace("set", ""), 10) || 0,
    type: "EXPANSION" as const,
  };
}

describe("createLorcanaPackSimulator", () => {
  it("generates a pack with the correct structure", () => {
    const cards: LorcanaCard[] = [];
    for (const ink of LORCANA_INK_TYPES) {
      for (let i = 0; i < 5; i++) {
        cards.push(
          makeCard(`${ink}-common-${i}`, {
            inkType: [ink],
            rarity: LORCANA_RARITIES.COMMON,
            set: "005",
          }),
        );
      }
      cards.push(
        makeCard(`${ink}-uncommon`, {
          inkType: [ink],
          rarity: LORCANA_RARITIES.UNCOMMON,
          set: "005",
        }),
      );
      cards.push(
        makeCard(`${ink}-rare`, {
          inkType: [ink],
          rarity: LORCANA_RARITIES.RARE,
          set: "005",
        }),
      );
    }

    const simulator = createLorcanaPackSimulator({
      cards,
      sets: { set5: makeSet("set5", "Shimmering Skies") },
    });

    const result = simulator.generatePack("005");

    expect(result.setId).toBe("005");
    expect(result.slots).toHaveLength(12);

    const nonFoilSlots = result.slots.filter((s) => !s.foil);
    const foilSlots = result.slots.filter((s) => s.foil);

    const counts: Record<string, number> = {};
    for (const slot of nonFoilSlots) {
      counts[slot.slotType] = (counts[slot.slotType] ?? 0) + 1;
    }

    expect(counts.common).toBe(6);
    expect(counts.uncommon).toBe(3);
    expect((counts.rare ?? 0) + (counts.super_rare ?? 0) + (counts.legendary ?? 0)).toBe(2);
    expect(foilSlots).toHaveLength(1);
  });

  it("is deterministic with the same seed", () => {
    const cards: LorcanaCard[] = [];
    for (const ink of LORCANA_INK_TYPES) {
      for (let i = 0; i < 10; i++) {
        cards.push(
          makeCard(`${ink}-${i}`, {
            inkType: [ink],
            rarity: LORCANA_RARITIES.COMMON,
            set: "005",
          }),
        );
      }
    }

    const simulator = createLorcanaPackSimulator({
      cards,
      sets: { set5: makeSet("set5", "Shimmering Skies") },
    });

    const first = simulator.generatePack("005", "seed-1");
    const second = simulator.generatePack("005", "seed-1");

    expect(first.slots.map((s) => s.cardRef)).toEqual(second.slots.map((s) => s.cardRef));
  });

  it("falls back to the full pool when the set has no cards", () => {
    const cards: LorcanaCard[] = [
      makeCard("fallback", {
        inkType: ["amber"],
        rarity: LORCANA_RARITIES.COMMON,
        set: "005",
      }),
    ];

    const simulator = createLorcanaPackSimulator({
      cards,
      sets: { set5: makeSet("set5", "Shimmering Skies") },
    });

    const result = simulator.generatePack("999");
    expect(result.slots.length).toBeGreaterThan(0);
  });

  it("excludes promo and special-rarity cards from normal packs", () => {
    const cards: LorcanaCard[] = [
      makeCard("promo", {
        inkType: ["amber"],
        rarity: "special",
        set: "005",
        specialRarity: "promo",
      }),
      makeCard("normal", {
        inkType: ["amber"],
        rarity: LORCANA_RARITIES.COMMON,
        set: "005",
      }),
    ];

    const simulator = createLorcanaPackSimulator({
      cards,
      sets: { set5: makeSet("set5", "Shimmering Skies") },
    });

    // With only one valid common, every common slot must resolve to it.
    const result = simulator.generatePack("005");
    const commonSlots = result.slots.filter((s) => s.slotType === LORCANA_RARITIES.COMMON);
    for (const slot of commonSlots) {
      expect(simulator.resolveCard(slot.cardRef)?.id).toBe("normal");
    }
  });

  it("accepts set definition ids like set5", () => {
    const cards: LorcanaCard[] = [
      makeCard("a", {
        inkType: ["amber"],
        rarity: LORCANA_RARITIES.COMMON,
        set: "005",
      }),
    ];

    const simulator = createLorcanaPackSimulator({
      cards,
      sets: {
        set5: makeSet("set5", "Shimmering Skies"),
      },
    });

    const result = simulator.generatePack("set5");
    expect(result.setId).toBe("set5");
    expect(result.slots.length).toBeGreaterThan(0);
  });

  it("lists available sets from card data", () => {
    const cards: LorcanaCard[] = [
      makeCard("a", {
        inkType: ["amber"],
        rarity: LORCANA_RARITIES.COMMON,
        set: "005",
      }),
      makeCard("b", {
        inkType: ["amber"],
        rarity: LORCANA_RARITIES.COMMON,
        set: "006",
      }),
    ];

    const simulator = createLorcanaPackSimulator({
      cards,
      sets: {
        set5: makeSet("set5", "Shimmering Skies"),
        set6: makeSet("set6", "Azurite Sea"),
      },
    });

    const sets = simulator.getAvailableSets();
    expect(sets.map((s) => s.id)).toEqual(["set5", "set6"]);
    expect(sets[0]?.name).toBe("Shimmering Skies");
  });
});
