import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrBigShrewdTycoon } from "./174-mr-big-shrewd-tycoon";

const lowStrengthAttacker = createMockCharacter({
  id: "mr-big-low-str",
  name: "Low Strength Attacker",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const exactlyTwoStrengthAttacker = createMockCharacter({
  id: "mr-big-two-str",
  name: "Two Strength Attacker",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const highStrengthAttacker = createMockCharacter({
  id: "mr-big-high-str",
  name: "High Strength Attacker",
  cost: 3,
  strength: 6,
  willpower: 3,
  lore: 1,
});

describe("Mr. Big - Shrewd Tycoon", () => {
  describe("REPUTATION - This character can't be challenged by characters with 2 {S} or more", () => {
    it("character with 1 strength CAN challenge Mr. Big", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [lowStrengthAttacker], deck: 1 },
        { play: [{ card: mrBigShrewdTycoon, exerted: true }], deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().challenge(lowStrengthAttacker, mrBigShrewdTycoon),
      ).toBeSuccessfulCommand();
    });

    it("character with exactly 2 strength can NOT challenge Mr. Big", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [exactlyTwoStrengthAttacker], deck: 1 },
        { play: [{ card: mrBigShrewdTycoon, exerted: true }], deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().challenge(exactlyTwoStrengthAttacker, mrBigShrewdTycoon).success,
      ).toBe(false);
    });

    it("character with 6 strength can NOT challenge Mr. Big", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [highStrengthAttacker], deck: 1 },
        { play: [{ card: mrBigShrewdTycoon, exerted: true }], deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().challenge(highStrengthAttacker, mrBigShrewdTycoon).success,
      ).toBe(false);
    });
  });
});
