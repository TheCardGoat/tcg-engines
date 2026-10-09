import { describe, expect, it } from "vite-plus/test";

import { cyberpunkCardI18n, getMergedCyberpunkCards, structuredCards } from "../src/index.ts";

describe("cyberpunkCardI18n", () => {
  it("covers exactly the structured card slugs", () => {
    const slugs = structuredCards.map((card) => card.slug);
    expect(Object.keys(cyberpunkCardI18n).toSorted()).toEqual(slugs.toSorted());
  });

  it("authors an en entry with non-empty name and displayName for every card", () => {
    for (const card of structuredCards) {
      const entry = cyberpunkCardI18n[card.slug]?.en;
      expect(entry, card.slug).toBeDefined();
      expect(entry?.name.length ?? 0, card.slug).toBeGreaterThan(0);
      expect(entry?.displayName.length ?? 0, card.slug).toBeGreaterThan(0);
    }
  });

  it("is the single text source: hydrated card text equals the en entry", () => {
    for (const card of getMergedCyberpunkCards()) {
      const en = cyberpunkCardI18n[card.slug]?.en;
      expect(card.name, card.slug).toBe(en?.name);
      expect(card.displayName, card.slug).toBe(en?.displayName);
      expect(card.rulesText ?? undefined, card.slug).toBe(en?.rulesText);
      expect(card.flavorText ?? undefined, card.slug).toBe(en?.flavorText);
    }
  });
});
