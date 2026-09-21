import { describe, expect, it } from "vitest";
import { structuredCards } from "@tcg/cyberpunk-cards";
import {
  authoredBotLabDeckSpecs,
  resolveAuthoredBotLabDeck,
  validateDeck,
} from "@tcg/cyberpunk-utils";
import { getCyberpunkPracticeCatalog } from "./practice";

describe("Cyberpunk practice catalog", () => {
  it("lists every authored bot-lab deck", () => {
    const catalog = getCyberpunkPracticeCatalog();
    expect(catalog.decks.map((deck) => deck.id)).toEqual(
      authoredBotLabDeckSpecs.map((spec) => spec.id),
    );
    expect(catalog.decks.every((deck) => deck.name.length > 0)).toBe(true);
  });

  it("only exposes production bot strategies", () => {
    const { strategies } = getCyberpunkPracticeCatalog();
    const ids = strategies.map((strategy) => strategy.id);
    expect(ids).toContain("default");
    expect(ids).not.toContain("greedy");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every catalog deck resolves to a legal deck", () => {
    const cardIds = new Set(structuredCards.map((card) => card.id));
    for (const spec of authoredBotLabDeckSpecs) {
      const resolved = resolveAuthoredBotLabDeck(spec);
      expect(validateDeck(resolved.legends, resolved.mainDeck)).toEqual([]);
      expect(resolved.legends.every((card) => cardIds.has(card.id))).toBe(true);
      expect(resolved.mainDeck.every((card) => cardIds.has(card.id))).toBe(true);
    }
  });
});
