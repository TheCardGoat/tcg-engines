/**
 * Catalog integrity: verifies that every TypeScript card file's `id` field
 * matches the data module's derived printing lookup.
 *
 * Why this test exists: package card files are the runtime source of truth.
 * If card files or auxiliary lookup data drift, deck import and art-selection
 * flows can substitute the wrong short IDs.
 */

import { describe, expect, it } from "bun:test";
import { canonicalCardsByPrintingId, cardsAuxKv } from "../data";
import { getAllCards } from "./index";

/** Derive the printing lookup key from a runtime card's metadata. */
function printingKey(card: { set: string; cardNumber: number; specialRarity?: string }): string {
  const setNum = parseInt(card.set, 10);
  const cardNum = String(card.cardNumber).padStart(3, "0");
  const base = `set${setNum}-${cardNum}`;
  return card.specialRarity ? `${base}-${card.specialRarity}` : base;
}

describe("catalog integrity", () => {
  it("every card id matches the derived printing lookup", async () => {
    const allCards = await getAllCards();
    const mismatches: string[] = [];

    for (const card of allCards) {
      const key =
        Object.entries(cardsAuxKv.printingIdToShortId).find(
          ([, shortId]) => shortId === card.id,
        )?.[0] ?? printingKey(card);
      const entry = canonicalCardsByPrintingId[key];
      if (!entry) {
        mismatches.push(`${key} "${card.name}": missing from derived lookup`);
        continue;
      }

      if (entry.id !== card.id) {
        mismatches.push(
          `${key} "${card.name}": TypeScript id="${card.id}", derived lookup says "${entry.id}"`,
        );
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("no two cards share the same id", async () => {
    const allCards = await getAllCards();
    const seen = new Map<string, string>();
    const duplicates: string[] = [];

    for (const card of allCards) {
      const prev = seen.get(card.id);
      if (prev !== undefined) {
        duplicates.push(`id "${card.id}" used by "${prev}" and "${card.name}"`);
      } else {
        seen.set(card.id, card.name);
      }
    }

    expect(duplicates).toEqual([]);
  });

  // Catches regressions where special printings are generated without enough identity
  // to distinguish them from the base collector number.
  it("no two cards share the same printing id", async () => {
    const allCards = await getAllCards();
    const seen = new Map<string, { id: string; name: string }>();
    const duplicates: string[] = [];

    for (const card of allCards) {
      for (const printing of card.printings) {
        const prev = seen.get(printing.id);
        if (prev !== undefined) {
          duplicates.push(
            `printing "${printing.id}" shared by "${prev.name}" [${prev.id}] and "${card.name}" [${card.id}]`,
          );
        } else {
          seen.set(printing.id, { id: card.id, name: card.name });
        }
      }
    }

    expect(duplicates).toEqual([]);
  });
});
