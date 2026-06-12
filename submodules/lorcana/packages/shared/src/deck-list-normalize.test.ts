/**
 * Deck list normalization and hashing tests.
 */

import { describe, expect, it } from "bun:test";
import {
  type DeckListCard,
  canonicalListHash,
  getEmptyListHash,
  isSynergyForm,
  isTemplateForm,
  parseDeckListString,
  parseDeckListStringWithErrors,
  toLorcanaFormat,
  toSynergyForm,
  toTemplateForm,
} from "./deck-list-normalize";

describe("toTemplateForm", () => {
  it("caps qty >= 4 to 4", () => {
    expect(toTemplateForm([{ cardId: "a", quantity: 5 }])).toEqual([{ cardId: "a", quantity: 4 }]);
  });

  it("maps 3 -> 2", () => {
    expect(toTemplateForm([{ cardId: "a", quantity: 3 }])).toEqual([{ cardId: "a", quantity: 2 }]);
  });

  it("keeps 2 unchanged", () => {
    expect(toTemplateForm([{ cardId: "a", quantity: 2 }])).toEqual([{ cardId: "a", quantity: 2 }]);
  });

  it("removes 1-copy cards", () => {
    expect(toTemplateForm([{ cardId: "a", quantity: 1 }])).toEqual([]);
  });

  it("returns canonical order (by cardId)", () => {
    const out = toTemplateForm([
      { cardId: "z", quantity: 2 },
      { cardId: "a", quantity: 2 },
    ]);
    expect(out).toEqual([
      { cardId: "a", quantity: 2 },
      { cardId: "z", quantity: 2 },
    ]);
  });

  it("mixed quantities", () => {
    const in_: DeckListCard[] = [
      { cardId: "a", quantity: 4 },
      { cardId: "b", quantity: 3 },
      { cardId: "c", quantity: 2 },
      { cardId: "d", quantity: 1 },
    ];
    expect(toTemplateForm(in_)).toEqual([
      { cardId: "a", quantity: 4 },
      { cardId: "b", quantity: 2 },
      { cardId: "c", quantity: 2 },
    ]);
  });
});

describe("toLorcanaFormat", () => {
  it("returns empty string for empty list", () => {
    expect(toLorcanaFormat([])).toBe("");
  });

  it("formats single card as quantity then cardId", () => {
    expect(toLorcanaFormat([{ cardId: "Darkwing Duck - Drake Mallard", quantity: 4 }])).toBe(
      "4 Darkwing Duck - Drake Mallard",
    );
  });

  it("one line per card, canonical order", () => {
    const cards: DeckListCard[] = [
      { cardId: "Vision of the Future", quantity: 4 },
      { cardId: "Hades - Infernal Schemer", quantity: 4 },
    ];
    expect(toLorcanaFormat(cards)).toBe("4 Hades - Infernal Schemer\n4 Vision of the Future");
  });
});

describe("parseDeckListString", () => {
  it("parses a simple deck list string correctly", () => {
    const input = "Hades - Infernal Schemer:4,Vision of the Future:4";
    const expected = [
      { cardId: "Hades - Infernal Schemer", quantity: 4 },
      { cardId: "Vision of the Future", quantity: 4 },
    ];
    expect(parseDeckListString(input)).toEqual(expected);
  });

  it("handles card names with colons correctly", () => {
    const input = "Card:With:Colon:2,Another Card:3";
    const expected = [
      { cardId: "Another Card", quantity: 3 },
      { cardId: "Card:With:Colon", quantity: 2 },
    ];
    expect(parseDeckListString(input)).toEqual(expected);
  });

  it("returns an empty array for an empty string", () => {
    expect(parseDeckListString("")).toEqual([]);
  });

  it("returns an empty array for a whitespace-only string", () => {
    expect(parseDeckListString("   ")).toEqual([]);
  });

  it("ignores malformed entries and parses valid ones", () => {
    const input = "Valid Card:2,MalformedEntry,Another Valid:4";
    const expected = [
      { cardId: "Another Valid", quantity: 4 },
      { cardId: "Valid Card", quantity: 2 },
    ];
    expect(parseDeckListString(input)).toEqual(expected);
  });

  it("handles invalid quantities (non-numeric, zero, negative)", () => {
    const input = "Good Card:2,BadQty:abc,ZeroQty:0,NegativeQty:-1,Another Good:3";
    const expected = [
      { cardId: "Another Good", quantity: 3 },
      { cardId: "Good Card", quantity: 2 },
    ];
    expect(parseDeckListString(input)).toEqual(expected);
  });

  it("sorts parsed cards into canonical order", () => {
    const input = "Card C:1,Card A:3,Card B:2";
    const expected = [
      { cardId: "Card A", quantity: 3 },
      { cardId: "Card B", quantity: 2 },
      { cardId: "Card C", quantity: 1 },
    ];
    expect(parseDeckListString(input)).toEqual(expected);
  });

  it("handles mixed valid and invalid entries, preserves canonical order", () => {
    const input = "Card B:2,InvalidEntry,Card A:4,BadQty:X,Card C:1";
    const expected = [
      { cardId: "Card A", quantity: 4 },
      { cardId: "Card B", quantity: 2 },
      { cardId: "Card C", quantity: 1 },
    ];
    expect(parseDeckListString(input)).toEqual(expected);
  });
});

describe("parseDeckListStringWithErrors", () => {
  it("returns same cards as parseDeckListString when no malformed entries", () => {
    const input = "Hades - Infernal Schemer:4,Vision of the Future:4";
    const withErrors = parseDeckListStringWithErrors(input);
    expect(withErrors.cards).toEqual(parseDeckListString(input));
    expect(withErrors.invalid).toEqual([]);
  });

  it("collects malformed entries", () => {
    const input = "Valid Card:2,MalformedEntry,Another Valid:4,BadQty:abc";
    const { cards, invalid } = parseDeckListStringWithErrors(input);
    expect(cards).toEqual([
      { cardId: "Another Valid", quantity: 4 },
      { cardId: "Valid Card", quantity: 2 },
    ]);
    expect(invalid).toEqual(
      expect.arrayContaining([
        { kind: "malformed", text: "MalformedEntry" },
        { kind: "malformed", text: "BadQty:abc" },
      ]),
    );
    expect(invalid).toHaveLength(2);
  });

  it("returns empty cards and invalid for empty string", () => {
    const { cards, invalid } = parseDeckListStringWithErrors("");
    expect(cards).toEqual([]);
    expect(invalid).toEqual([]);
  });
});

describe("toSynergyForm", () => {
  it("keeps only cards with qty > 1, sets each to 1", () => {
    const in_: DeckListCard[] = [
      { cardId: "a", quantity: 4 },
      { cardId: "b", quantity: 1 },
    ];
    expect(toSynergyForm(in_)).toEqual([{ cardId: "a", quantity: 1 }]);
  });

  it("returns [] when no card has qty > 1", () => {
    expect(toSynergyForm([{ cardId: "a", quantity: 1 }])).toEqual([]);
  });

  it("returns canonical order", () => {
    const out = toSynergyForm([
      { cardId: "z", quantity: 2 },
      { cardId: "a", quantity: 2 },
    ]);
    expect(out).toEqual([
      { cardId: "a", quantity: 1 },
      { cardId: "z", quantity: 1 },
    ]);
  });
});

describe("isTemplateForm", () => {
  it("returns true when list is unchanged by toTemplateForm", () => {
    expect(isTemplateForm([{ cardId: "a", quantity: 2 }])).toBe(true);
    expect(isTemplateForm([{ cardId: "a", quantity: 4 }])).toBe(true);
  });

  it("returns false when list has 1-copy or 3-copy", () => {
    expect(isTemplateForm([{ cardId: "a", quantity: 1 }])).toBe(false);
    expect(isTemplateForm([{ cardId: "a", quantity: 3 }])).toBe(false);
  });
});

describe("isSynergyForm", () => {
  it("returns true when every entry has quantity 1", () => {
    expect(isSynergyForm([{ cardId: "a", quantity: 1 }])).toBe(true);
    expect(
      isSynergyForm([
        { cardId: "a", quantity: 1 },
        { cardId: "b", quantity: 1 },
      ]),
    ).toBe(true);
  });

  it("returns true for empty list", () => {
    expect(isSynergyForm([])).toBe(true);
  });

  it("returns false when any entry has quantity > 1", () => {
    expect(isSynergyForm([{ cardId: "a", quantity: 2 }])).toBe(false);
  });
});

describe("canonicalListHash", () => {
  it("is order-independent: same list different order yields same hash", () => {
    const listA: DeckListCard[] = [
      { cardId: "a", quantity: 1 },
      { cardId: "b", quantity: 2 },
    ];
    const listB: DeckListCard[] = [
      { cardId: "b", quantity: 2 },
      { cardId: "a", quantity: 1 },
    ];
    expect(canonicalListHash(listA)).toBe(canonicalListHash(listB));
  });

  it("is order-independent: reverse order yields same hash", () => {
    const list: DeckListCard[] = [
      { cardId: "a", quantity: 1 },
      { cardId: "b", quantity: 2 },
      { cardId: "c", quantity: 3 },
      { cardId: "d", quantity: 4 },
    ];
    const reversed: DeckListCard[] = [...list].reverse();
    expect(canonicalListHash(list)).toBe(canonicalListHash(reversed));
  });

  it("is order-independent: shuffled order yields same hash", () => {
    const list: DeckListCard[] = [
      { cardId: "m", quantity: 2 },
      { cardId: "a", quantity: 4 },
      { cardId: "z", quantity: 1 },
      { cardId: "k", quantity: 3 },
    ];
    const shuffled: DeckListCard[] = [
      { cardId: "z", quantity: 1 },
      { cardId: "m", quantity: 2 },
      { cardId: "a", quantity: 4 },
      { cardId: "k", quantity: 3 },
    ];
    expect(canonicalListHash(list)).toBe(canonicalListHash(shuffled));
  });

  it("is order-independent: any permutation yields same hash", () => {
    const permutations: DeckListCard[][] = [
      [
        { cardId: "x", quantity: 1 },
        { cardId: "y", quantity: 2 },
        { cardId: "z", quantity: 3 },
      ],
      [
        { cardId: "y", quantity: 2 },
        { cardId: "z", quantity: 3 },
        { cardId: "x", quantity: 1 },
      ],
      [
        { cardId: "z", quantity: 3 },
        { cardId: "x", quantity: 1 },
        { cardId: "y", quantity: 2 },
      ],
    ];
    const hashes = permutations.map((p) => canonicalListHash(p));
    expect(hashes[0]).toBe(hashes[1]);
    expect(hashes[1]).toBe(hashes[2]);
  });

  it("different lists yield different hashes", () => {
    const a = canonicalListHash([{ cardId: "a", quantity: 1 }]);
    const b = canonicalListHash([{ cardId: "b", quantity: 1 }]);
    expect(a).not.toBe(b);
  });

  it("empty list yields deterministic hash", () => {
    expect(canonicalListHash([])).toBe(canonicalListHash([]));
  });
});

describe("getEmptyListHash", () => {
  it("equals canonicalListHash([])", () => {
    expect(getEmptyListHash()).toBe(canonicalListHash([]));
  });

  it("is stable across calls", () => {
    expect(getEmptyListHash()).toBe(getEmptyListHash());
  });
});
