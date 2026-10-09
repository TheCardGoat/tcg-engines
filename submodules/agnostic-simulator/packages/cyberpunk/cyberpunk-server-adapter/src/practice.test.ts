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

  it("recommends three distinct pool decks, leader first", () => {
    const catalog = getCyberpunkPracticeCatalog();
    const deckIds = new Set(catalog.decks.map((deck) => deck.id));
    expect(catalog.recommendedDeckIds).toHaveLength(3);
    expect(new Set(catalog.recommendedDeckIds).size).toBe(3);
    expect(catalog.recommendedDeckIds.every((id) => deckIds.has(id))).toBe(true);
    expect(catalog.recommendedDeckIds[0]).toBe("authored-yorinobu-two-units-for-one");
  });

  it("exposes production strategies plus the practice test strategies", () => {
    const { strategies } = getCyberpunkPracticeCatalog();
    const ids = strategies.map((strategy) => strategy.id);
    expect(strategies.find((strategy) => strategy.id === "default")).toMatchObject({
      label: "Recommended",
      description: expect.stringContaining("Sees both hands"),
    });
    expect(ids).toContain("attack-rival-only");
    expect(ids).toContain("pass-only");
    expect(strategies.find((strategy) => strategy.id === "expert-oracle")).toMatchObject({
      label: "Expert (full information)",
      description: expect.stringContaining("Sees both hands"),
    });
    expect(ids).not.toContain("greedy");
    expect(ids).not.toContain("random");
    expect(ids).not.toContain("first-legal");
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
