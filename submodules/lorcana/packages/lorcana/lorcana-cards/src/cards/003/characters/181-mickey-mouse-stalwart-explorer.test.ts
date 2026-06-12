import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { mickeyMouseStalwartExplorer } from "./181-mickey-mouse-stalwart-explorer";

const myLocation = createMockLocation({
  id: "stalwart-explorer-location-1",
  name: "Treasure Planet",
  cost: 2,
  willpower: 4,
  lore: 1,
});

const myLocation2 = createMockLocation({
  id: "stalwart-explorer-location-2",
  name: "Treasure Island",
  cost: 2,
  willpower: 4,
  lore: 1,
});

const opponentLocation = createMockLocation({
  id: "stalwart-explorer-opp-location",
  name: "Opponent Location",
  cost: 2,
  willpower: 4,
  lore: 1,
});

describe("Mickey Mouse - Stalwart Explorer", () => {
  describe("LET'S TAKE A LOOK - +1 strength per location", () => {
    it("has no strength bonus when no locations are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseStalwartExplorer],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseStalwartExplorer);
      expect(card.strength).toBe(mickeyMouseStalwartExplorer.strength);
    });

    it("gets +1 strength with 1 location in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseStalwartExplorer, myLocation],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseStalwartExplorer);
      expect(card.strength).toBe(mickeyMouseStalwartExplorer.strength + 1);
    });

    it("gets +2 strength with 2 locations in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseStalwartExplorer, myLocation, myLocation2],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseStalwartExplorer);
      expect(card.strength).toBe(mickeyMouseStalwartExplorer.strength + 2);
    });

    it("does not count opponent's locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [mickeyMouseStalwartExplorer], deck: 5 },
        { play: [opponentLocation], deck: 5 },
      );

      const card = testEngine.asPlayerOne().getCard(mickeyMouseStalwartExplorer);
      expect(card.strength).toBe(mickeyMouseStalwartExplorer.strength);
    });
  });
});
