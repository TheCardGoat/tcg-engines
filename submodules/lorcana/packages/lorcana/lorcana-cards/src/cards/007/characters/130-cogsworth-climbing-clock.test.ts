import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { cogsworthClimbingClock } from "./130-cogsworth-climbing-clock";

const discardItem = createMockItem({
  id: "cogsworth-test-item",
  name: "Test Item",
  cost: 1,
});

describe("Cogsworth - Climbing Clock", () => {
  describe("STILL USEFUL - While you have an item card in your discard, this character gets +2 {S}.", () => {
    it("gets +2 strength while an item card is in your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [cogsworthClimbingClock],
        discard: [discardItem],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(cogsworthClimbingClock)).toBe(
        cogsworthClimbingClock.strength + 2,
      );
    });

    it("stays at base strength when there is no item card in your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [cogsworthClimbingClock],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(cogsworthClimbingClock)).toBe(
        cogsworthClimbingClock.strength,
      );
    });
  });
});
