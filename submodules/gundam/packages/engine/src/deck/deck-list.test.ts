import { describe, expect, it } from "vite-plus/test";

import type { Card, ResourceCard, UnitCard } from "@tcg/gundam-types";

import {
  GUNDAM_MAIN_DECK_SIZE,
  GUNDAM_RESOURCE_DECK_SIZE,
  isDeckListToken,
  validateDeckList,
  type DeckList,
} from "./deck-list.ts";

/**
 * Build a catalog fixture with three distinct units and one resource,
 * enough to compose a 50-card decklist with legal copy counts.
 * Uses only public `Card`-shape fields so it's isolated from engine
 * mock helpers.
 */
function unit(cardNumber: string, cost: number): UnitCard {
  return {
    cardNumber,
    name: `Test Unit ${cardNumber}`,
    type: "unit",
    color: "blue",
    traits: ["earth federation"],
    level: cost,
    cost,
    ap: 2,
    hp: 3,
    effect: "-",
    effects: [],
    keywordEffects: [],
    rarity: "common",
  };
}

const RESOURCE: ResourceCard = {
  cardNumber: "R-001",
  name: "resource",
  type: "resource",
  traits: ["-"],
  level: 0,
  cost: 0,
  effect: "",
  effects: [],
  keywordEffects: [],
  rarity: "common",
};

const UNIT_A = unit("ST01-001", 1);
const UNIT_B = unit("ST01-002", 2);
const UNIT_C = unit("ST01-003", 3);

const CATALOG: Record<string, Card> = {
  [UNIT_A.cardNumber]: UNIT_A,
  [UNIT_B.cardNumber]: UNIT_B,
  [UNIT_C.cardNumber]: UNIT_C,
  [RESOURCE.cardNumber]: RESOURCE,
};

/** 50 main (4+4+4+ ...). Build via thirteen 4-of's + a 2-of (wrong math). */
/**
 * A deliberately undersized deck (12 main + 10 resource) used by
 * tests that want to pin rules *other* than main-deck size against
 * the small three-card catalog. Tests that need a size-correct deck
 * use `fiftyCardLegal()` below, which builds its own extended
 * catalog.
 */
function undersizedDeck(): DeckList {
  return {
    name: "undersized",
    cards: [
      { cardNumber: UNIT_A.cardNumber, count: 4 },
      { cardNumber: UNIT_B.cardNumber, count: 4 },
      { cardNumber: UNIT_C.cardNumber, count: 4 },
    ],
    resource: { cardNumber: RESOURCE.cardNumber, count: GUNDAM_RESOURCE_DECK_SIZE },
  };
}

/** Catalog + decklist that sums to exactly 50 legally (≤ 4 per card). */
function fiftyCardLegal(): { catalog: Record<string, Card>; list: DeckList } {
  const catalog: Record<string, Card> = { [RESOURCE.cardNumber]: RESOURCE };
  const entries: { cardNumber: string; count: number }[] = [];
  // 13 cards of 4 copies = 52 — too many. Use 12 × 4 = 48 + 1 × 2 = 50.
  for (let i = 0; i < 12; i++) {
    const cn = `ST01-${String(100 + i).padStart(3, "0")}`;
    catalog[cn] = unit(cn, 1);
    entries.push({ cardNumber: cn, count: 4 });
  }
  const filler = "ST01-112";
  catalog[filler] = unit(filler, 1);
  entries.push({ cardNumber: filler, count: 2 });
  return {
    catalog,
    list: {
      name: "fifty-legal",
      cards: entries,
      resource: { cardNumber: RESOURCE.cardNumber, count: GUNDAM_RESOURCE_DECK_SIZE },
    },
  };
}

describe("validateDeckList: happy path", () => {
  it("accepts a canonical 50-main + 10-resource deck", () => {
    const { catalog, list } = fiftyCardLegal();
    const result = validateDeckList(list, { catalog });
    expect(result.ok).toBe(true);
  });
});

describe("validateDeckList: size rules", () => {
  it("rejects a 51-card main deck", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      cards: [...list.cards, { cardNumber: "ST01-112", count: 1 }],
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("exactly 50"))).toBe(true);
  });

  it("rejects a 49-card main deck", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      cards: list.cards.slice(0, -1),
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("exactly 50"))).toBe(true);
  });

  it("rejects a resource deck of 9 cards", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = { ...list, resource: { ...list.resource, count: 9 } };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("exactly 10"))).toBe(true);
  });
});

describe("validateDeckList: copy rule", () => {
  it("rejects 5 copies of a single card", () => {
    const list = undersizedDeck();
    const bad: DeckList = {
      ...list,
      cards: [
        { cardNumber: UNIT_A.cardNumber, count: 5 },
        { cardNumber: UNIT_B.cardNumber, count: 4 },
        { cardNumber: UNIT_C.cardNumber, count: 4 },
      ],
    };
    const result = validateDeckList(bad, { catalog: CATALOG });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("exceeds max"))).toBe(true);
  });

  it("rejects 3 + 2 of the same card (aggregates across duplicate entries)", () => {
    const { catalog, list } = fiftyCardLegal();
    // Rewrite the first entry split across two lines summing to 5
    const first = list.cards[0];
    if (!first) throw new Error("empty");
    const bad: DeckList = {
      ...list,
      cards: [
        { cardNumber: first.cardNumber, count: 3 },
        { cardNumber: first.cardNumber, count: 2 },
        ...list.cards.slice(1),
      ],
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("exceeds max"))).toBe(true);
  });
});

describe("validateDeckList: catalog resolution", () => {
  it("rejects an unknown cardNumber", () => {
    const list: DeckList = {
      name: "bad",
      cards: [{ cardNumber: "NOT-A-REAL-CARD", count: GUNDAM_MAIN_DECK_SIZE }],
      resource: { cardNumber: RESOURCE.cardNumber, count: GUNDAM_RESOURCE_DECK_SIZE },
    };
    const result = validateDeckList(list, { catalog: CATALOG });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("unknown card"))).toBe(true);
  });

  it("rejects an unknown resource cardNumber", () => {
    const list = undersizedDeck();
    const bad: DeckList = {
      ...list,
      resource: { cardNumber: "R-NONE", count: GUNDAM_RESOURCE_DECK_SIZE },
    };
    const result = validateDeckList(bad, { catalog: CATALOG });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("unknown resource"))).toBe(true);
  });

  it("rejects a non-resource card in the resource slot", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      resource: { cardNumber: "ST01-100", count: GUNDAM_RESOURCE_DECK_SIZE },
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("must be a resource card"))).toBe(true);
  });

  it("rejects a resource card placed in the main deck", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      cards: [...list.cards, { cardNumber: RESOURCE.cardNumber, count: 1 }],
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("belong in the resource deck"))).toBe(true);
  });
});

describe("validateDeckList: tokens", () => {
  it("rejects token cardNumbers in the main deck", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      cards: [...list.cards, { cardNumber: "EXBP-001", count: 1 }],
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("token"))).toBe(true);
  });

  it("rejects token cardNumbers in the resource slot", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      resource: { cardNumber: "EXRP-003", count: GUNDAM_RESOURCE_DECK_SIZE },
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("token"))).toBe(true);
  });

  it("reports both token AND wrong-size errors when the resource slot has both problems", () => {
    // Regression: earlier the count check was nested inside the
    // `else` branch of the token guard, so a token cardNumber masked
    // size issues. `validateDeckList` must surface both.
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = {
      ...list,
      resource: { cardNumber: "EXRP-003", count: 0 },
    };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("token"))).toBe(true);
    expect(result.errors.some((e) => e.includes("exactly 10"))).toBe(true);
  });

  it("isDeckListToken identifies engine tokens", () => {
    expect(isDeckListToken("EXBP-001")).toBe(true);
    expect(isDeckListToken("EXRP-003")).toBe(true);
    expect(isDeckListToken("ST01-001")).toBe(false);
  });

  // Regression: in-game token printings live under the `T-` prefix
  // (`cards/t/unit/`). Once they're exported from the catalog they
  // become resolvable card numbers — deck validation must continue to
  // reject them as engine-spawn-only.
  it("rejects T-prefixed in-game token printings", () => {
    expect(isDeckListToken("T-001")).toBe(true);
    expect(isDeckListToken("T-007")).toBe(true);
    expect(isDeckListToken("T-012")).toBe(true);
    // Real cards should still pass.
    expect(isDeckListToken("ST01-015")).toBe(false);
    expect(isDeckListToken("GD01-026")).toBe(false);
  });
});

describe("validateDeckList: structural errors", () => {
  it("rejects an empty name", () => {
    const { catalog, list } = fiftyCardLegal();
    const bad: DeckList = { ...list, name: "" };
    const result = validateDeckList(bad, { catalog });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("non-empty name"))).toBe(true);
  });

  it("rejects zero and negative counts", () => {
    const list: DeckList = {
      name: "zero",
      cards: [{ cardNumber: UNIT_A.cardNumber, count: 0 }],
      resource: { cardNumber: RESOURCE.cardNumber, count: GUNDAM_RESOURCE_DECK_SIZE },
    };
    const result = validateDeckList(list, { catalog: CATALOG });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes("positive integer"))).toBe(true);
  });

  it("collects multiple errors rather than short-circuiting", () => {
    const list: DeckList = {
      name: "",
      cards: [
        { cardNumber: "NOT-REAL", count: 1 },
        { cardNumber: UNIT_A.cardNumber, count: 5 },
      ],
      resource: { cardNumber: "R-MISSING", count: 3 },
    };
    const result = validateDeckList(list, { catalog: CATALOG });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe("validateDeckList: constants", () => {
  it("exposes official Gundam TCG sizes", () => {
    expect(GUNDAM_MAIN_DECK_SIZE).toBe(50);
    expect(GUNDAM_RESOURCE_DECK_SIZE).toBe(10);
  });
});
