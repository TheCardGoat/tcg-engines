import { describe, expect, it } from "bun:test";
import { getAllCardsById } from "../cards";
import { getLorcanaDisplayName, resolveLorcanaDeckListText } from "./deck-list-resolver";

describe("deck-list-resolver", () => {
  it("resolves punctuation and case normalization variants", async () => {
    const result = await resolveLorcanaDeckListText("1 Grab your Bow\n1 Sail The Azurite Sea");

    expect(result.diagnostics.malformedLines).toHaveLength(0);
    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    expect(result.cards).toHaveLength(2);
    expect(result.cards.map((card) => getLorcanaDisplayName(card))).toEqual([
      "Grab Your Bow",
      "Sail the Azurite Sea",
    ]);
  });

  it("resolves legacy alias display names", async () => {
    const result = await resolveLorcanaDeckListText("1 Mother Gothel - Devious Conspirator");

    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    expect(getLorcanaDisplayName(result.cards[0] ?? result.resolvedCards[0].card)).toBe(
      "Mother Gothel - Underhanded Schemer",
    );
  });

  it("prefers latest set then lower rarity for ambiguous names", async () => {
    const result = await resolveLorcanaDeckListText("1 Under The Sea\n1 Into The Unknown");

    const underTheSea = result.resolvedCards[0];
    const intoTheUnknown = result.resolvedCards[1];

    expect(underTheSea?.card.set).toBe("009");
    expect(intoTheUnknown?.card.rarity).toBe("common");
  });

  it("reports malformed lines without throwing", async () => {
    const result = await resolveLorcanaDeckListText(
      "1 Sail The Azurite Sea\nthis line is malformed",
    );

    expect(result.diagnostics.malformedLines).toHaveLength(1);
    expect(result.cards).toHaveLength(1);
    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
  });

  it("reports unresolved names for package-only resolution", async () => {
    const result = await resolveLorcanaDeckListText("1 Definitely Not A Real Lorcana Card");

    expect(result.diagnostics.unresolvedNames).toEqual(["Definitely Not A Real Lorcana Card"]);
    expect(result.diagnostics.malformedLines).toHaveLength(0);
    expect(result.cards).toHaveLength(0);
  });

  it("resolves German localized card names", async () => {
    const result = await resolveLorcanaDeckListText("1 Sonnenschein - Gute Fee");

    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    expect(result.cards).toHaveLength(1);
    expect(getLorcanaDisplayName(result.cards[0]!)).toBe("Merryweather - Good Fairy");
  });

  it("resolves mixed English and German deck list", async () => {
    const result = await resolveLorcanaDeckListText("1 Sonnenschein - Gute Fee\n1 Grab your Bow");

    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    expect(result.cards).toHaveLength(2);
    expect(result.cards.map((card) => getLorcanaDisplayName(card))).toEqual([
      "Merryweather - Good Fairy",
      "Grab Your Bow",
    ]);
  });

  it("resolves French localized card names with accents", async () => {
    const result = await resolveLorcanaDeckListText("1 Pimprenelle - Bonne fée");

    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    expect(result.cards).toHaveLength(1);
    expect(getLorcanaDisplayName(result.cards[0]!)).toBe("Merryweather - Good Fairy");
  });

  it("resolves Finders Keepers to the amethyst card, not Three Arrows Epic", async () => {
    const result = await resolveLorcanaDeckListText("1 Finders Keepers");

    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    const resolved = result.resolvedCards[0];
    expect(resolved?.card.name).toBe("Finders Keepers");
    expect(resolved?.card.inkType).toEqual(["amethyst"]);
    // Canonical id for Finders Keepers (set5-060) per generated package cards.
    expect(resolved?.cardId).toBe("J7L");

    // The resolved id must map back to Finders Keepers, not Three Arrows Epic
    const byId = await getAllCardsById();
    const lookedUp = byId[resolved!.cardId];
    expect(lookedUp?.name).toBe("Finders Keepers");
    expect(lookedUp?.inkType).toEqual(["amethyst"]);
  });

  it("no two cards share the same id", async () => {
    const byId = await getAllCardsById();
    const allCards = await import("../cards").then((m) => m.getAllCards());
    const seen = new Map<string, string>();
    for (const card of allCards) {
      const prev = seen.get(card.id);
      expect(prev).toBeUndefined(); // duplicate: prev card name if fails
      seen.set(card.id, card.name);
    }
  });

  it("expands deck list quantities", async () => {
    const result = await resolveLorcanaDeckListText("2 Sail The Azurite Sea\n1 Grab your Bow");

    expect(result.diagnostics.unresolvedNames).toHaveLength(0);
    expect(result.cards).toHaveLength(3);
    expect(result.resolvedCards).toEqual([
      {
        cardName: "Sail The Azurite Sea",
        quantity: 2,
        card: result.cards[0],
        cardId: result.cards[0]!.id,
      },
      {
        cardName: "Grab your Bow",
        quantity: 1,
        card: result.cards[2],
        cardId: result.cards[2]!.id,
      },
    ]);
  });
});
