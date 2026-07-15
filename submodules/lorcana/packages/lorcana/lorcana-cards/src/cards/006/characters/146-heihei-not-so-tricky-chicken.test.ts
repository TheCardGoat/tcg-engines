import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { heiheiNotsotrickyChicken } from "./146-heihei-not-so-tricky-chicken";

const opposingItem = createMockItem({
  id: "heihei-test-opposing-item",
  name: "Opposing Item",
  cost: 2,
});

describe("Heihei - Not-So-Tricky Chicken", () => {
  describe("EAT ANYTHING — When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.", () => {
    it("exerts a chosen opposing item when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiNotsotrickyChicken],
          inkwell: heiheiNotsotrickyChicken.cost,
        },
        {
          play: [opposingItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(heiheiNotsotrickyChicken)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(heiheiNotsotrickyChicken, {
          targets: [opposingItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(true);
    });

    it("applies cant-ready to the chosen opposing item (active on their next turn), not to Heihei", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiNotsotrickyChicken],
          inkwell: heiheiNotsotrickyChicken.cost,
          deck: 1,
        },
        {
          play: [opposingItem],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(heiheiNotsotrickyChicken)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(heiheiNotsotrickyChicken, {
          targets: [opposingItem],
        }),
      ).toBeSuccessfulCommand();

      // Pass to player two's turn — cant-ready restriction becomes active on the item
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opposingItem, "cant-ready")).toBe(true);
      expect(testEngine.hasRestriction(heiheiNotsotrickyChicken, "cant-ready")).toBe(false);
    });

    it("the chosen opposing item cannot ready at the start of its controller's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiNotsotrickyChicken],
          inkwell: heiheiNotsotrickyChicken.cost,
        },
        {
          play: [opposingItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(heiheiNotsotrickyChicken)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(heiheiNotsotrickyChicken, {
          targets: [opposingItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(true);

      // Pass to player two's turn — cant-ready restriction becomes active and item stays exerted
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(true);
      expect(testEngine.hasRestriction(opposingItem, "cant-ready")).toBe(true);

      // Pass back to player one's turn — restriction should be gone, item can now be readied
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasRestriction(opposingItem, "cant-ready")).toBe(false);

      const itemId = testEngine.findCardInstanceId(opposingItem, "play", PLAYER_TWO);
      expect(testEngine.asServer().manualReadyCard(itemId)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(false);
    });
  });
});
