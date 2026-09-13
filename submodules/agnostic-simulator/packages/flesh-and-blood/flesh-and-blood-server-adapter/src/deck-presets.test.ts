import { describe, expect, it } from "vitest";
import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { FAB_DECK_CATALOG } from "@tcg/flesh-and-blood-engine/automation";
import { fleshAndBloodPracticeDecks, listFleshAndBloodDeckPresets } from "./deck-presets.ts";

describe("FAB practice deck presets", () => {
  it("publishes only official preconstructed lists legal under the current format rules", () => {
    const presets = listFleshAndBloodDeckPresets();

    expect(presets.length).toBeGreaterThan(0);
    expect(presets.some((preset) => preset.format === "Blitz")).toBe(false);
    expect(presets.some((preset) => preset.name === "Arakni, Web of Deceit Blitz Deck")).toBe(
      false,
    );
  });

  it("resolves every curated list to canonical, sectioned cards without losing copies", () => {
    for (const preset of FAB_DECK_CATALOG) {
      const deck = fleshAndBloodPracticeDecks.getDeck(preset.id);
      expect(deck, preset.id).toBeDefined();
      const expectedCount = preset.cards
        .split("\n")
        .reduce((total, line) => total + Number.parseInt(line, 10), 0);
      expect(
        deck!.reduce((total, card) => total + card.quantity, 0),
        preset.id,
      ).toBe(expectedCount);
      expect(
        deck!.filter((card) => card.sectionId === "hero"),
        preset.id,
      ).toHaveLength(1);
      for (const entry of deck!) {
        expect(getFleshAndBloodCard(entry.cardId)?.canonicalId).toBe(entry.cardId);
        expect(entry.canonicalId).toBe(entry.cardId);
        expect(["hero", "cardPool"]).toContain(entry.sectionId);
      }
    }
  });

  it("does not substitute a different fixture for an unknown id", () => {
    expect(fleshAndBloodPracticeDecks.getDeck("missing-preset")).toBeUndefined();
  });
});
