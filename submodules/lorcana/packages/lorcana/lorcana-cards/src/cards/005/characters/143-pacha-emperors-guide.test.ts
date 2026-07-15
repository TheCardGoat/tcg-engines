import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { pachaEmperorsGuide } from "./143-pacha-emperors-guide";

const allyItem = createMockItem({
  id: "pacha-eg-test-item",
  name: "Test Item",
  cost: 2,
});

const allyLocation = createMockLocation({
  id: "pacha-eg-test-location",
  name: "Test Location",
  cost: 2,
  willpower: 5,
  lore: 0,
});

describe("Pacha - Emperor's Guide", () => {
  describe("HELPFUL SUPPLIES — At the start of your turn, if you have an item in play, gain 1 lore.", () => {
    it("gains 1 lore at the start of your turn when you have an item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pachaEmperorsGuide, allyItem],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Pass player one's turn, then player two's turn to come back to start of player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      // HELPFUL SUPPLIES (item) condition is met so it's enqueued; PERFECT DIRECTIONS (location)
      // condition is NOT met so it's NOT enqueued. Only 1 lore is gained.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      testEngine.asPlayerOne().resolveAllBagEffects();

      // At start of player one's next turn, HELPFUL SUPPLIES should have fired
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does NOT gain lore at the start of your turn when you have no item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pachaEmperorsGuide],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // No item in play, so no lore should be gained
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });

  describe("PERFECT DIRECTIONS — At the start of your turn, if you have a location in play, gain 1 lore.", () => {
    it("gains 1 lore at the start of your turn when you have a location in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Use a location with lore: 0 to isolate the triggered ability lore gain
          // from the base location lore mechanic (gainLoreFromLocations in pass-turn)
          play: [pachaEmperorsGuide, allyLocation],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      // HELPFUL SUPPLIES (item) condition is NOT met; PERFECT DIRECTIONS (location) condition
      // IS met so it's enqueued. Only 1 lore is gained.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      testEngine.asPlayerOne().resolveAllBagEffects();

      // At start of player one's next turn, PERFECT DIRECTIONS should have fired
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does NOT gain lore at the start of your turn when you have no location in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pachaEmperorsGuide],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // No location in play, so no lore should be gained
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("gains 2 lore total when both an item and a location are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Use location with lore: 0 to isolate the triggered ability from base lore gain
          play: [pachaEmperorsGuide, allyItem, allyLocation],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Both HELPFUL SUPPLIES and PERFECT DIRECTIONS should be in the bag, resolved one at a time
      testEngine.asPlayerOne().resolveAllBagEffects();

      // Both HELPFUL SUPPLIES and PERFECT DIRECTIONS should fire: +1 +1 = +2
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });
  });
});
