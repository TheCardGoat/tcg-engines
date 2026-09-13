import { describe, expect, it } from "vitest";

import {
  fleshAndBloodPreconstructedDecks,
  fleshAndBloodPreconstructedDecksById,
  getFleshAndBloodPreconstructedDeck,
} from "./preconstructed-decks.ts";
import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";

describe("Flesh and Blood preconstructed decks", () => {
  it("loads the complete verified Fabrary snapshot", () => {
    expect(fleshAndBloodPreconstructedDecks).toHaveLength(90);
    expect(fleshAndBloodPreconstructedDecksById.size).toBe(90);
    expect(
      countBy(fleshAndBloodPreconstructedDecks, (deck) => deck.officialVerification.status),
    ).toEqual({
      "official-list-match": 46,
      "official-list-discrepancy": 10,
      "official-product-verified": 34,
    });
  });

  it("preserves every preconstructed format", () => {
    expect(countBy(fleshAndBloodPreconstructedDecks, (deck) => deck.format)).toEqual({
      Blitz: 42,
      "Classic Constructed": 23,
      "Living Legend": 2,
      Open: 3,
      "Silver Age": 16,
      "Ultimate Pit Fight": 4,
    });
  });

  it("keeps pitch and inventory quantities distinct", () => {
    const katsu = fleshAndBloodPreconstructedDecks.find(
      (deck) => deck.deckId === "01GW28TF5FXFKJ5CGRNXB84CG6",
    );

    expect(katsu?.cards.find((card) => card.cardIdentifier === "surging-strike-red")).toMatchObject(
      {
        name: "Surging Strike",
        pitch: 1,
        quantity: 2,
        inventoryQuantity: 0,
      },
    );
    expect(katsu?.officialVerification.notes).toEqual([
      "Missing from Fabrary: 1x Heat Wave",
      "Extra in Fabrary: 1x Quelling Slippers",
    ]);
  });

  it("provides deterministic deck lookup", () => {
    const deckId = "01KYX5AKV8MSXP5310XSYF15DJ";
    expect(getFleshAndBloodPreconstructedDeck(deckId)).toMatchObject({
      name: "Prism Silver Age Deck",
      format: "Silver Age",
      hero: { name: "Prism, Advent of Thrones" },
      officialVerification: { status: "official-product-verified" },
    });
    expect(getFleshAndBloodPreconstructedDeck("missing")).toBeUndefined();
  });

  it("imports Armory Deck: Olympia with catalog-resolvable cards", () => {
    const olympia = getFleshAndBloodPreconstructedDeck("01KP7ZJNFZZD8YNGP438FT8SFG");
    const catalogSlugs = new Set(fleshAndBloodCatalog.cards.map((card) => card.slug));

    expect(olympia).toBeDefined();
    if (!olympia) throw new Error("Expected Armory Deck: Olympia");

    expect(olympia).toMatchObject({
      name: "Armory Deck: Olympia",
      format: "Classic Constructed",
      hero: { cardIdentifier: "olympia-prized-fighter", name: "Olympia, Prized Fighter" },
      officialVerification: {
        status: "official-list-discrepancy",
        notes: ["Quantity: Prized Galea LSS=2 Fabrary=3"],
      },
    });
    expect(olympia.cards.reduce((total, card) => total + card.quantity, 0)).toBe(67);
    expect(
      [olympia.hero.cardIdentifier, ...olympia.cards.map((card) => card.cardIdentifier)].every(
        (cardIdentifier) => catalogSlugs.has(cardIdentifier),
      ),
    ).toBe(true);
  });
});

function countBy<T>(values: readonly T[], key: (value: T) => string): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    const entry = key(value);
    counts[entry] = (counts[entry] ?? 0) + 1;
    return counts;
  }, {});
}
