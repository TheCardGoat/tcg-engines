import { describe, expect, it } from "vitest";
import { FAB_DECK_CATALOG, getFabDeck, isFabTournamentDeck, listFabDecks } from "./deck-catalog.ts";
import { FAB_DECK_TEXT_FIXTURES } from "./deck-text-fixtures.ts";

describe("FAB deck catalog", () => {
  it("registers only format-legal tournament text lists under unique ids", () => {
    expect(FAB_DECK_CATALOG).toHaveLength(FAB_DECK_TEXT_FIXTURES.length);
    const ids = FAB_DECK_CATALOG.map((deck) => deck.id);
    expect(new Set(ids).size).toBe(FAB_DECK_CATALOG.length);
    expect(FAB_DECK_CATALOG.every((deck) => isFabTournamentDeck(deck) && !deck.playable)).toBe(
      true,
    );
  });

  it("filters by constructed format, hero class, and event", () => {
    expect(listFabDecks({ format: "classic-constructed" }).length).toBeGreaterThanOrEqual(20);
    expect(listFabDecks({ format: "silver-age" })).toHaveLength(5);
    expect(listFabDecks({ heroClass: "wizard" }).map((deck) => deck.id)).toEqual(
      expect.arrayContaining([
        "sa-edinburgh-2nd-oscilio",
        "sa-edinburgh-5th-blaze",
        "cc-2026-08-11-aurora-legacy-of-tempest",
        "cc-konrad-weiss-oscilio",
        "cc-hamburg-2nd-oscilio",
      ]),
    );
    expect(listFabDecks({ event: "Calling: Edinburgh" })).toHaveLength(5);
  });

  it("attaches origin and class metadata on tournament lists", () => {
    const gravy = getFabDeck("cc-edinburgh-1st-gravy-bones");
    expect(gravy).toMatchObject({
      kind: "tournament",
      format: "classic-constructed",
      heroClass: "pirate",
      event: "Calling: Edinburgh",
      placement: 1,
      origin: {
        kind: "fabrary",
        url: "https://fabrary.net/decks/01KYF5FGZCG7QH0R4P3W5VQ133",
      },
    });
    if (!gravy || !isFabTournamentDeck(gravy)) {
      throw new Error("expected tournament gravy bones list");
    }
    expect(gravy.hero).toBe("Gravy Bones, Shipwrecked Looter");
    expect(gravy.cards.startsWith("1x Gravy Bones, Shipwrecked Looter\n")).toBe(true);

    const community = getFabDeck("cc-guilherme-coutinho-rhinar");
    expect(community?.origin).toEqual({
      kind: "community",
      author: "Guilherme Coutinho",
    });
  });
});
