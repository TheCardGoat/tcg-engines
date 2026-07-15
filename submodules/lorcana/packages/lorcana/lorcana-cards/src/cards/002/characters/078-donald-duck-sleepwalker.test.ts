import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckSleepwalker } from "./078-donald-duck-sleepwalker";
import { nothingToHide } from "../actions/165-nothing-to-hide";
import { zeroToHero } from "../actions/032-zero-to-hero";

describe("Donald Duck - Sleepwalker", () => {
  describe("STARTLED AWAKE - Whenever you play an action, this character gets +2 {S} this turn.", () => {
    it("gains +2 strength when you play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: nothingToHide.cost,
        hand: [nothingToHide],
        play: [donaldDuckSleepwalker],
      });

      const initialStrength = donaldDuckSleepwalker.strength;

      testEngine.asPlayerOne().playCard(nothingToHide);

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        initialStrength + 2,
      );
    });

    it("gains +2 strength for each action played (stacks)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: nothingToHide.cost + zeroToHero.cost,
        hand: [nothingToHide, zeroToHero],
        play: [donaldDuckSleepwalker],
      });

      const initialStrength = donaldDuckSleepwalker.strength;

      testEngine.asPlayerOne().playCard(nothingToHide);
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        initialStrength + 2,
      );

      testEngine.asPlayerOne().playCard(zeroToHero);
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        initialStrength + 4,
      );
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: nothingToHide.cost,
          hand: [nothingToHide],
          play: [donaldDuckSleepwalker],
        },
        {
          deck: 5,
        },
      );

      const initialStrength = donaldDuckSleepwalker.strength;

      testEngine.asPlayerOne().playCard(nothingToHide);
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        initialStrength + 2,
      );

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(initialStrength);
    });

    it("does not gain strength when opponent plays an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckSleepwalker],
        },
        {
          inkwell: nothingToHide.cost,
          hand: [nothingToHide],
        },
      );

      const initialStrength = donaldDuckSleepwalker.strength;

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().playCard(nothingToHide);

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(initialStrength);
    });
  });
});
