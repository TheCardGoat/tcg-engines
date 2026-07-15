import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { johnSilverGreedyTreasureSeeker } from "./176-john-silver-greedy-treasure-seeker";

describe("John Silver - Greedy Treasure Seeker", () => {
  describe("CHART YOUR OWN COURSE - For each location you have in play, this character gains Resist +1 and gets +1 {L}.", () => {
    it("gets +1 lore for each location in play", () => {
      const myLocation = createMockLocation({
        id: "location-001",
        name: "Treasure Planet",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverGreedyTreasureSeeker, myLocation],
        deck: 5,
      });

      const baseLore = johnSilverGreedyTreasureSeeker.lore ?? 0;
      expect(testEngine.asPlayerOne().getCardLore(johnSilverGreedyTreasureSeeker)).toBe(
        baseLore + 1,
      );
    });

    it("gets +2 lore when two locations are in play", () => {
      const myLocation1 = createMockLocation({
        id: "location-002a",
        name: "Treasure Planet",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const myLocation2 = createMockLocation({
        id: "location-002b",
        name: "Treasure Island",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverGreedyTreasureSeeker, myLocation1, myLocation2],
        deck: 5,
      });

      const baseLore = johnSilverGreedyTreasureSeeker.lore ?? 0;
      expect(testEngine.asPlayerOne().getCardLore(johnSilverGreedyTreasureSeeker)).toBe(
        baseLore + 2,
      );
    });

    it("has no lore bonus when no locations are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverGreedyTreasureSeeker],
        deck: 5,
      });

      const baseLore = johnSilverGreedyTreasureSeeker.lore ?? 0;
      expect(testEngine.asPlayerOne().getCardLore(johnSilverGreedyTreasureSeeker)).toBe(baseLore);
    });

    it("gains Resist +1 for each location in play", () => {
      const myLocation = createMockLocation({
        id: "location-003",
        name: "Treasure Planet",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverGreedyTreasureSeeker, myLocation],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().getKeywordValue(johnSilverGreedyTreasureSeeker, "Resist"),
      ).toBe(1);
    });

    it("gains Resist +2 when two locations are in play", () => {
      const myLocation1 = createMockLocation({
        id: "location-004a",
        name: "Treasure Planet",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const myLocation2 = createMockLocation({
        id: "location-004b",
        name: "Treasure Island",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverGreedyTreasureSeeker, myLocation1, myLocation2],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().getKeywordValue(johnSilverGreedyTreasureSeeker, "Resist"),
      ).toBe(2);
    });

    it("has no Resist when no locations are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverGreedyTreasureSeeker],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().getKeywordValue(johnSilverGreedyTreasureSeeker, "Resist"),
      ).toBe(null);
    });

    it("does not gain lore bonus from opponent's locations", () => {
      const opponentLocation = createMockLocation({
        id: "location-005",
        name: "Opponent Location",
        cost: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [johnSilverGreedyTreasureSeeker], deck: 5 },
        { play: [opponentLocation], deck: 5 },
      );

      const baseLore = johnSilverGreedyTreasureSeeker.lore ?? 0;
      expect(testEngine.asPlayerOne().getCardLore(johnSilverGreedyTreasureSeeker)).toBe(baseLore);
    });
  });
});
