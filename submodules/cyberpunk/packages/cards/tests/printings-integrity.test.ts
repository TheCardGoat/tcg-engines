import { describe, expect, it } from "vite-plus/test";

import {
  cards,
  getMergedCyberpunkCards,
  getMergedCyberpunkCardsById,
  RUNTIME_SET_CODES,
} from "../src/index.ts";

const CARD_IMAGE_BASE_URL = "https://cdn.tcg.online/public/cyberpunk/cards/";

describe("printings integrity", () => {
  it("owns each printing id exactly once across the merged pool", () => {
    const ownerByPrintingId = new Map<string, string>();
    const conflicts: string[] = [];
    for (const card of getMergedCyberpunkCards()) {
      for (const printing of card.printings) {
        const owner = ownerByPrintingId.get(printing.id);
        if (owner && owner !== card.slug) {
          conflicts.push(`${printing.id}: ${owner} vs ${card.slug}`);
        }
        ownerByPrintingId.set(printing.id, card.slug);
      }
    }
    expect(conflicts).toEqual([]);
  });

  it("preserves every runtime-set raw printing on its canonical card", () => {
    const runtimeSetCodes = new Set<string>(RUNTIME_SET_CODES);
    const bySlug = new Map(getMergedCyberpunkCards().map((card) => [card.slug, card]));
    const missing: string[] = [];
    for (const raw of cards.filter((card) => runtimeSetCodes.has(card.set.code))) {
      const canonical = bySlug.get(raw.slug);
      if (!canonical) {
        missing.push(`${raw.set.code}:${raw.slug} has no canonical card`);
        continue;
      }
      for (const printing of raw.printings) {
        if (!canonical.printings.some((candidate) => candidate.id === printing.id)) {
          missing.push(`${raw.slug} is missing printing ${printing.id} (${printing.setCode})`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("resolves every printing id through the merged lookup to its owning card", () => {
    for (const card of getMergedCyberpunkCards()) {
      for (const printing of card.printings) {
        expect(getMergedCyberpunkCardsById().get(printing.id)?.slug).toBe(card.slug);
      }
    }
  });

  it("keeps every merged printing image on the deterministic CDN pattern", () => {
    for (const card of getMergedCyberpunkCards()) {
      for (const printing of card.printings) {
        expect(
          printing.imageUrl.startsWith(CARD_IMAGE_BASE_URL),
          `${card.slug} printing ${printing.id}`,
        ).toBe(true);
      }
    }
  });
});
