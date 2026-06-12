import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { miloThatchSpiritedScholar } from "./115-milo-thatch-spirited-scholar";

const testLocation = createMockLocation({
  id: "spirited-scholar-location",
  name: "Test Location",
  cost: 2,
  willpower: 4,
  lore: 1,
});

describe("Milo Thatch - Spirited Scholar", () => {
  describe("I'M YOUR MAN! - +2 strength while at a location", () => {
    it("gets +2 strength while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: miloThatchSpiritedScholar, atLocation: testLocation }, testLocation],
      });

      const card = testEngine.asPlayerOne().getCard(miloThatchSpiritedScholar);
      expect(card.strength).toBe(miloThatchSpiritedScholar.strength + 2);
    });

    it("has base strength when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [miloThatchSpiritedScholar, testLocation],
      });

      const card = testEngine.asPlayerOne().getCard(miloThatchSpiritedScholar);
      expect(card.strength).toBe(miloThatchSpiritedScholar.strength);
    });
  });
});
