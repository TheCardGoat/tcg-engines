import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { razoulMenacingGuard } from "./189-razoul-menacing-guard";
import { jafarKeeperOfSecrets } from "../../001/characters/044-jafar-keeper-of-secrets";

const testItem = createMockItem({
  id: "test-item",
  name: "Test Item",
  cost: 2,
});

describe("Razoul - Menacing Guard", () => {
  describe("MY ORDERS COME FROM JAFAR — When you play this character, if you have a character named Jafar in play, you may banish chosen item.", () => {
    it("does not trigger when no Jafar is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [razoulMenacingGuard],
          inkwell: razoulMenacingGuard.cost,
          deck: 2,
        },
        {
          play: [testItem],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(razoulMenacingGuard)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers and allows banishing chosen item when Jafar is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [razoulMenacingGuard],
          play: [jafarKeeperOfSecrets],
          inkwell: razoulMenacingGuard.cost,
          deck: 2,
        },
        {
          play: [testItem],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(razoulMenacingGuard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(razoulMenacingGuard, { targets: [testItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(testItem)).toBe("discard");
    });
  });
});
