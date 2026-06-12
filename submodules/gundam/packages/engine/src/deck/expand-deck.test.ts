import { describe, expect, it } from "vite-plus/test";

import type { Card, ResourceCard, UnitCard } from "@tcg/gundam-types";

import type { DeckList } from "./deck-list.ts";
import { expandDeck } from "./expand-deck.ts";

function unit(cardNumber: string): UnitCard {
  return {
    cardNumber,
    name: `Unit ${cardNumber}`,
    type: "unit",
    color: "blue",
    traits: ["earth federation"],
    level: 1,
    cost: 1,
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

const UNIT_A = unit("ST01-001");
const UNIT_B = unit("ST01-002");

const CATALOG: Record<string, Card> = {
  [UNIT_A.cardNumber]: UNIT_A,
  [UNIT_B.cardNumber]: UNIT_B,
  [RESOURCE.cardNumber]: RESOURCE,
};

const LIST: DeckList = {
  name: "test",
  cards: [
    { cardNumber: UNIT_A.cardNumber, count: 4 },
    { cardNumber: UNIT_B.cardNumber, count: 3 },
  ],
  resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
};

describe("expandDeck", () => {
  it("expands counts into flat arrays", () => {
    const { deck, resourceDeck } = expandDeck(LIST, { catalog: CATALOG });
    expect(deck).toHaveLength(7);
    expect(resourceDeck).toHaveLength(10);
  });

  it("preserves catalog object identity (no cloning)", () => {
    const { deck, resourceDeck } = expandDeck(LIST, { catalog: CATALOG });
    for (const card of deck) {
      if (card.cardNumber === UNIT_A.cardNumber) {
        expect(card).toBe(UNIT_A);
      } else {
        expect(card).toBe(UNIT_B);
      }
    }
    for (const card of resourceDeck) expect(card).toBe(RESOURCE);
  });

  it("keeps repeated entries contiguous in output order", () => {
    const { deck } = expandDeck(LIST, { catalog: CATALOG });
    expect(deck.slice(0, 4).every((c) => c.cardNumber === UNIT_A.cardNumber)).toBe(true);
    expect(deck.slice(4).every((c) => c.cardNumber === UNIT_B.cardNumber)).toBe(true);
  });

  it("throws on unknown main-deck card", () => {
    const bad: DeckList = {
      ...LIST,
      cards: [{ cardNumber: "NOT-REAL", count: 1 }],
    };
    expect(() => expandDeck(bad, { catalog: CATALOG })).toThrow(/unknown card/);
  });

  it("throws on unknown resource card", () => {
    const bad: DeckList = { ...LIST, resource: { cardNumber: "R-NONE", count: 10 } };
    expect(() => expandDeck(bad, { catalog: CATALOG })).toThrow(/unknown resource/);
  });

  it("accepts a Map catalog", () => {
    const map = new Map<string, Card>(Object.entries(CATALOG));
    const { deck, resourceDeck } = expandDeck(LIST, { catalog: map });
    expect(deck).toHaveLength(7);
    expect(resourceDeck).toHaveLength(10);
  });

  it("throws on a zero-count entry (callers that skip validateDeckList still fail fast)", () => {
    const bad: DeckList = {
      ...LIST,
      cards: [{ cardNumber: UNIT_A.cardNumber, count: 0 }],
    };
    expect(() => expandDeck(bad, { catalog: CATALOG })).toThrow(/non-positive count/);
  });

  it("throws on a negative-count entry", () => {
    const bad: DeckList = {
      ...LIST,
      cards: [{ cardNumber: UNIT_A.cardNumber, count: -1 }],
    };
    expect(() => expandDeck(bad, { catalog: CATALOG })).toThrow(/non-positive count/);
  });

  it("throws on a non-positive resource count", () => {
    const bad: DeckList = { ...LIST, resource: { cardNumber: RESOURCE.cardNumber, count: 0 } };
    expect(() => expandDeck(bad, { catalog: CATALOG })).toThrow(/non-positive count/);
  });
});
