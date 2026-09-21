import { describe, expect, test } from "vite-plus/test";
import type { OPCard } from "@tcg/op-types";
import { allCards, hasCard, legacyPrintingIdAliases } from "../src/index.ts";

/**
 * Printings integrity (One Piece Comprehensive Rules 2-14 / 5-1-2-3): a card
 * number identifies exactly one card, so every print of a card carries that
 * card's canonical number, and every printing id identifies one physical
 * print. These guardrails hold the catalog together for the canonical-card
 * consolidation (one definition per canonicalId, prints in `printings[]`).
 */

const SUFFIXED_NAME =
  /\((?:Reprint|Pirate Foil|SP|Jolly Roger Foil|Parallel|Alternate Art|Alt Art|SPR|Manga Rare|Wanted Poster|Full Art|Silver|Gold)\)$| - [A-Z0-9]+-[0-9]+/;

function cardNumber(printing: OPCard["printings"][number]): string {
  return `${printing.setCode}-${printing.collectorNumber}`;
}

describe("printings integrity", () => {
  test("every printing id identifies exactly one definition", () => {
    const owners = new Map<string, string[]>();
    for (const card of allCards) {
      for (const printing of card.printings) {
        owners.set(printing.id, [...(owners.get(printing.id) ?? []), card.id]);
      }
    }
    const shared = [...owners.entries()].filter(([, ids]) => ids.length > 1);
    expect(shared).toEqual([]);
  });

  test("every card number resolves to at most one canonical card", () => {
    const canonicals = new Map<string, Set<string>>();
    for (const card of allCards) {
      for (const printing of card.printings) {
        const number = cardNumber(printing);
        if (!canonicals.has(number)) canonicals.set(number, new Set());
        canonicals.get(number)!.add(card.canonicalId);
      }
    }
    const collisions = [...canonicals.entries()].filter(([, ids]) => ids.size > 1);
    expect(collisions.map(([number, ids]) => `${number}: ${[...ids].join(", ")}`)).toEqual([]);
  });

  test("canonical definitions carry their own print first and a printed name", () => {
    for (const card of allCards) {
      if (card.id !== card.canonicalId) continue;
      expect(card.printings.length).toBeGreaterThan(0);
      expect(card.printings[0].id).toBe(card.id);
      expect(card.printings[0].setCode).toBe(card.setId);
      expect(card.name).not.toMatch(SUFFIXED_NAME);
    }
  });

  test("every definition prints its canonical number on every printing", () => {
    for (const card of allCards) {
      const canonical = /^([A-Z]+\d*)-(.+)$/.exec(card.canonicalId);
      if (!canonical) continue;
      const expected = `${canonical[1]}-${canonical[2]}`;
      for (const printing of card.printings) {
        expect(
          cardNumber(printing),
          `${card.id} printing ${printing.id} must print ${card.canonicalId}`,
        ).toBe(expected);
      }
    }
  });

  test("legacy pre-consolidation ids resolve to their owning canonical card", () => {
    // The consolidation renamed/reprinted hashed print ids (e.g. the EB02
    // SPR of OP05-001) and dropped 47 spread-copy definition ids; stored
    // references to them must keep resolving.
    expect(Object.keys(legacyPrintingIdAliases).length).toBeGreaterThan(40);
    const currentIds = new Set(
      allCards.flatMap((card) => [card.id, ...card.printings.map((printing) => printing.id)]),
    );
    for (const [legacyId, canonicalId] of Object.entries(legacyPrintingIdAliases)) {
      expect(currentIds.has(legacyId), `${legacyId} should not resolve on its own`).toBe(false);
      expect(currentIds.has(canonicalId), `${legacyId} -> ${canonicalId} target must exist`).toBe(
        true,
      );
      expect(hasCard(legacyId), `${legacyId} must resolve through the runtime catalog`).toBe(true);
    }
    expect(legacyPrintingIdAliases["OP05-001_aimdTZC"]).toBe("OP05-001");
  });
});
