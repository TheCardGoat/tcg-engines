import { describe, expect, it } from "bun:test";
import { mergeDuplicateCards, structuredCards } from "@tcg/cyberpunk-cards";
import { cyberpunkServerAdapter } from "./adapter";
import { listCyberpunkDeckPresets } from "./deck-presets";

describe("listCyberpunkDeckPresets", () => {
  it("publishes both official Welcome to Night City starters against the catalog", () => {
    const presets = listCyberpunkDeckPresets();
    const catalogIds = new Set(
      mergeDuplicateCards(structuredCards).map((card) => card.canonicalId),
    );

    expect(presets.map((preset) => preset.name)).toEqual([
      "Embracing Power Starter Deck",
      "The Heist Starter Deck",
    ]);

    for (const preset of presets) {
      expect(preset.sourceUrl).toBe("https://cyberpunktcg.com/blog/wnc-starter-decks");
      expect(preset.legends.reduce((total, entry) => total + entry.quantity, 0)).toBe(3);
      expect(preset.mainDeck.reduce((total, entry) => total + entry.quantity, 0)).toBe(40);
      expect(preset.mainDeck.every((entry) => entry.quantity <= 3)).toBe(true);
      expect(
        [...preset.legends, ...preset.mainDeck].every((entry) => catalogIds.has(entry.cardId)),
      ).toBe(true);

      const validation = cyberpunkServerAdapter.validateDeckForFormat("alpha", [
        ...preset.legends,
        ...preset.mainDeck,
      ]);
      expect(validation.valid).toBe(true);
      expect(validation.rules.filter((rule) => !rule.passed)).toEqual([]);
    }
  });
});
