import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { beastHardheaded } from "./172-beast-hardheaded";

const targetItem = createMockItem({
  id: "beast-hardheaded-target-item",
  name: "Target Item",
  cost: 1,
});

describe("Beast - Hardheaded", () => {
  describe("BREAK - When you play this character, you may banish chosen item.", () => {
    it("banishes chosen item when played and accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [beastHardheaded],
        inkwell: beastHardheaded.cost,
        play: [targetItem],
      });

      expect(testEngine.asPlayerOne().playCard(beastHardheaded)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastHardheaded, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("discard");
    });

    it("does not banish when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [beastHardheaded],
        inkwell: beastHardheaded.cost,
        play: [targetItem],
      });

      expect(testEngine.asPlayerOne().playCard(beastHardheaded)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastHardheaded, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("play");
    });

    it("plays successfully even with no items in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [beastHardheaded],
        inkwell: beastHardheaded.cost,
      });

      expect(testEngine.asPlayerOne().playCard(beastHardheaded)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(beastHardheaded)).toBe("play");
    });
  });
});
