import { describe, expect, test } from "vite-plus/test";
import type { OPCard } from "@tcg/op-types";
import { allCards, cardCatalog, getAllCards, getCard, hasCard } from "../src/index.ts";
import * as cardDefinitions from "../src/cards/index.ts";

function isCardDefinition(value: unknown): value is OPCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OPCard>;
  return typeof candidate.id === "string" && typeof candidate.cardType === "string";
}

const authoredCards = Object.values(cardDefinitions).filter(isCardDefinition);

function gameplaySignature(card: OPCard): unknown {
  return {
    cardType: card.cardType,
    color: card.color,
    cost: "cost" in card ? card.cost : undefined,
    power: "power" in card ? card.power : undefined,
    life: "life" in card ? card.life : undefined,
    counter: "counter" in card ? card.counter : undefined,
    trigger: "trigger" in card ? card.trigger : undefined,
    traits: card.traits,
    attribute: card.attribute,
    effect: card.effect,
    effects: card.effects,
  };
}

describe("@tcg/op-cards", () => {
  test("exports a populated catalog", () => {
    // One definition per canonical card (reprints/alt-arts live in
    // printings[]); ~3.3k physical prints across ~2.4k canonical cards after
    // the OP15–OP17 import. The upper bound catches accidental duplication.
    expect(allCards.length).toBeGreaterThan(1900);
    expect(allCards.length).toBeLessThan(3000);
    expect(allCards.length).toBe(authoredCards.length);
    expect(getAllCards()).toHaveLength(allCards.length);
  });

  test("supports card lookup helpers", () => {
    const luffy = getCard("OP13-001");

    expect(luffy.id).toBe("OP13-001");
    expect(luffy.i18n.en.name).toBe("Monkey.D.Luffy");
    expect(hasCard("OP13-001")).toBe(true);
    expect(hasCard("NOPE-999")).toBe(false);
    expect(cardCatalog.get("OP13-001")?.id).toBe("OP13-001");

    // A printing id resolves to the card it prints (rules 2-14 / 5-1-2-3).
    const namiSp = getCard("OP08-106_p2");
    expect(namiSp.id).toBe("OP08-106");
    expect(namiSp.canonicalId).toBe("OP08-106");
    expect(namiSp.printings.map((printing) => printing.id)).toContain("OP08-106_p2");
  });

  test("includes the canonical DON!! resource card", () => {
    const don = getAllCards().filter((card) => card.cardType === "don");

    expect(don).toHaveLength(1);
    expect(don[0]).toMatchObject({
      id: "DON-001",
      canonicalId: "DON-001",
      name: "DON!!",
      color: [],
      rarity: "DON",
    });
  });

  test("catalog ids are unique and sorted", () => {
    const ids = allCards.map((card) => card.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
    expect(ids[0]).toBe([...ids].sort((left, right) => left.localeCompare(right))[0]);
  });

  test("authored card ids are unique before catalog indexing", () => {
    const ids = authoredCards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("catalog slugs are unique", () => {
    const slugs = allCards.map((card) => card.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("every card carries the cross-game identity model (RFC ADR-11)", () => {
    for (const card of allCards) {
      expect(card.id.length).toBeGreaterThan(0);
      expect(card.canonicalId.length).toBeGreaterThan(0);
      expect(card.slug.length).toBeGreaterThan(0);
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
        expect(printing.imageUrl.length).toBeGreaterThan(0);
      }
      // The card's own rarity mirrors its primary print; reprints may carry a
      // different rarity on their printing entry.
      expect(card.printings[0]?.rarity).toBe(card.rarity);
      // Canonical definitions mirror their authored id on the primary print.
      expect(card.printings[0]?.id).toBe(card.id);
      // artVariants is no longer authored; consumers derive it from printings.
      expect(card.artVariants).toBeUndefined();
    }
  });

  test("uses name-based card detail slugs", () => {
    expect(getCard("EB01-050").slug).toBe("i-want-to-live");
    expect(getCard("OP06-081").slug).toBe("absalom/op06-081");
    expect(getCard("OP14-100").slug).toBe("absalom/op14-100");
    expect(getCard("OP14-095").slug).toBe("mr-9/op14-095");
  });

  test("reprints and alternate arts keep gameplay fields in sync", () => {
    const cardsByCanonicalId = new Map<string, OPCard[]>();
    for (const card of authoredCards) {
      const group = cardsByCanonicalId.get(card.canonicalId) ?? [];
      group.push(card);
      cardsByCanonicalId.set(card.canonicalId, group);
    }

    for (const [canonicalId, cards] of cardsByCanonicalId) {
      if (cards.length < 2) {
        continue;
      }

      const [baseCard, ...variants] = cards;
      const baseSignature = gameplaySignature(baseCard);

      for (const variant of variants) {
        expect(gameplaySignature(variant), `${variant.name} drifted from ${canonicalId}`).toEqual(
          baseSignature,
        );
      }
    }
  });
});
