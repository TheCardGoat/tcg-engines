import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { noiOrphanedThief } from "./155-noi-orphaned-thief";

const testItem = createMockItem({
  id: "noi-test-item",
  name: "Test Item",
  cost: 1,
});

describe("Noi - Orphaned Thief", () => {
  describe("HIDE AND SEEK - While you have an item in play, this character gains Resist +1 and Ward.", () => {
    it("gains Resist +1 and Ward when an item is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [noiOrphanedThief, testItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Ward")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(noiOrphanedThief, "Resist")).toBe(1);
    });

    it("does NOT have Resist or Ward when no item is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [noiOrphanedThief],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Ward")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(noiOrphanedThief, "Resist")).toBe(false);
    });
  });
});
