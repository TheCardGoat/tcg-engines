import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { arielWhoseitCollector } from "./137-ariel-whoseit-collector";

const itemA = createMockItem({
  id: "ariel-test-item-a",
  name: "Test Item A",
  cost: 2,
});

const itemB = createMockItem({
  id: "ariel-test-item-b",
  name: "Test Item B",
  cost: 1,
});

describe("Ariel - Whoseit Collector", () => {
  describe("LOOK AT THIS STUFF - Whenever you play an item, you may ready this character.", () => {
    it("should ready when an item is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [itemA],
        play: [arielWhoseitCollector],
        inkwell: itemA.cost,
        deck: 5,
      });

      // Quest to exert Ariel
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(arielWhoseitCollector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(arielWhoseitCollector).exerted).toBe(true);

      // Play an item — trigger should fire
      expect(testEngine.asPlayerOne().playCard(itemA)).toBeSuccessfulCommand();

      // Resolve the optional ability (accept)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();

      // Ariel should be ready now
      expect(testEngine.asPlayerOne().getCard(arielWhoseitCollector).exerted).toBe(false);
    });

    it("should trigger for each item played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [itemA, itemB],
        play: [arielWhoseitCollector],
        inkwell: itemA.cost + itemB.cost,
        deck: 5,
      });

      // Quest to exert Ariel
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(arielWhoseitCollector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(arielWhoseitCollector).exerted).toBe(true);

      // Play first item — trigger fires, accept ready
      expect(testEngine.asPlayerOne().playCard(itemA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(arielWhoseitCollector).exerted).toBe(false);

      // Play second item — trigger fires again (no once-per-turn restriction)
      expect(testEngine.asPlayerOne().playCard(itemB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("should NOT trigger when an opponent plays an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielWhoseitCollector],
          deck: 5,
        },
        {
          hand: [itemA],
          inkwell: itemA.cost,
          deck: 5,
        },
      );

      // Quest to exert Ariel
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(arielWhoseitCollector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(arielWhoseitCollector).exerted).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent plays an item
      expect(testEngine.asPlayerTwo().playCard(itemA)).toBeSuccessfulCommand();

      // No trigger should fire for player one
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCard(arielWhoseitCollector).exerted).toBe(true);
    });
  });
});
