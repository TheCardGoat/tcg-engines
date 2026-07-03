import { describe, expect, test } from "vite-plus/test";
import type { OPCard } from "@tcg/op-types";
import { allCards, cardCatalog, getAllCards, getCard, hasCard } from "../src/index.ts";
import * as cardDefinitions from "../src/cards/index.ts";

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isCardDefinition(value: unknown): value is OPCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OPCard>;
  return typeof candidate.id === "string" && typeof candidate.cardType === "string";
}

const authoredCards = Object.values(cardDefinitions).filter(isCardDefinition);

describe("@tcg/op-cards", () => {
  test("exports a populated catalog", () => {
    expect(allCards.length).toBeGreaterThan(1900);
    expect(getAllCards()).toHaveLength(allCards.length);
  });

  test("supports card lookup helpers", () => {
    const luffy = getCard("OP13-001");

    expect(luffy.id).toBe("OP13-001");
    expect(luffy.i18n.en.name).toBe("Monkey.D.Luffy");
    expect(hasCard("OP13-001")).toBe(true);
    expect(hasCard("NOPE-999")).toBe(false);
    expect(cardCatalog.get("OP13-001")?.id).toBe("OP13-001");
  });

  test("catalog ids are unique and sorted", () => {
    const ids = allCards.map((card) => card.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
    expect(ids[0]).toBe([...ids].sort((left, right) => left.localeCompare(right))[0]);
  });

  test("catalog slugs are unique", () => {
    const slugs = allCards.map((card) => card.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("every card carries the cross-game identity model (RFC ADR-11)", () => {
    const nameCounts = new Map<string, number>();
    for (const card of authoredCards) {
      const nameSlug = slugifyName(card.name);
      nameCounts.set(nameSlug, (nameCounts.get(nameSlug) ?? 0) + 1);
    }

    for (const card of allCards) {
      // canonicalId is seeded from id (ADR-9); slug is derived from the card name.
      expect(card.canonicalId).toBe(card.id);
      const nameSlug = slugifyName(card.name);
      const expectedSlug =
        (nameCounts.get(nameSlug) ?? 0) > 1
          ? `${nameSlug}/${card.canonicalId.toLowerCase()}`
          : nameSlug;
      expect(card.slug).toBe(expectedSlug);
      // Display name sourced from i18n.en.name to satisfy BaseCardDefinition.
      expect(card.name).toBe(card.i18n.en.name);
      // At least one printing; each carries id + artId + the full Printing shape.
      expect(card.printings.length).toBeGreaterThanOrEqual(1);
      for (const printing of card.printings) {
        expect(typeof printing.id).toBe("string");
        expect(printing.id.length).toBeGreaterThan(0);
        expect(typeof printing.artId).toBe("string");
        expect(printing.artId.length).toBeGreaterThan(0);
        expect(printing.setCode).toBe(card.setId);
        expect(printing.rarity).toBe(card.rarity);
        expect(printing.imageUrl.length).toBeGreaterThan(0);
      }
      // Base printing always mirrors the authored card id.
      expect(card.printings[0]?.id).toBe(card.id);
      // artVariants stays as a derived back-compat view alongside printings.
      if (card.artVariants !== undefined) {
        expect(card.artVariants.length).toBeGreaterThan(0);
      }
    }
  });

  test("uses name-based card detail slugs", () => {
    expect(getCard("EB01-050").slug).toBe("i-want-to-live");
    expect(getCard("OP06-081").slug).toBe("absalom/op06-081");
    expect(getCard("OP14-100").slug).toBe("absalom/op14-100");
    expect(getCard("OP14-095").slug).toBe("mr-9/op14-095");
  });
});
