import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { theTwinsLostBoys } from "./186-the-twins-lost-boys";

const targetCharacter = createMockCharacter({
  id: "twins-test-target",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const testLocation = createMockLocation({
  id: "twins-test-location",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 6,
  lore: 1,
});

describe("The Twins - Lost Boys", () => {
  describe("TWO FOR ONE - When you play this character, if you have a location in play, you may deal 2 damage to chosen character.", () => {
    it("should deal 2 damage to chosen character when a location is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theTwinsLostBoys.cost,
          hand: [theTwinsLostBoys],
          play: [testLocation],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theTwinsLostBoys)).toBeSuccessfulCommand();

      // Ability is optional and should appear in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theTwinsLostBoys, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(2);
    });

    it("should not trigger when no location is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theTwinsLostBoys.cost,
          hand: [theTwinsLostBoys],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theTwinsLostBoys)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Condition failed (no location in play), so no damage dealt
      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(0);
    });

    it("should be optional - can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: theTwinsLostBoys.cost,
          hand: [theTwinsLostBoys],
          play: [testLocation],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theTwinsLostBoys)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      // Decline the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theTwinsLostBoys),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(0);
    });
  });
});
