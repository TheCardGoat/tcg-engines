import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { robinHoodTimelyContestant } from "./069-robin-hood-timely-contestant";

describe("Robin Hood - Timely Contestant", () => {
  describe("TAG ME IN! — For each 1 damage on opposing characters, you pay 1 {I} less to play this character.", () => {
    it("costs full cost when no damage on opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodTimelyContestant],
          inkwell: robinHoodTimelyContestant.cost,
          deck: 2,
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodTimelyContestant)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robinHoodTimelyContestant)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less when 1 damage on an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodTimelyContestant],
          inkwell: robinHoodTimelyContestant.cost - 1,
          deck: 2,
        },
        {
          play: [{ card: goofyKnightForADay, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodTimelyContestant)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robinHoodTimelyContestant)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 3 less when 3 damage on an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodTimelyContestant],
          inkwell: robinHoodTimelyContestant.cost - 3,
          deck: 2,
        },
        {
          play: [{ card: goofyKnightForADay, damage: 3 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodTimelyContestant)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robinHoodTimelyContestant)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 5 less when 5 total damage across multiple opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodTimelyContestant],
          inkwell: robinHoodTimelyContestant.cost - 5,
          deck: 2,
        },
        {
          play: [
            { card: goofyKnightForADay, damage: 2 },
            { card: goofyKnightForADay, damage: 3 },
          ],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodTimelyContestant)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robinHoodTimelyContestant)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played when insufficient ink even with damage reduction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodTimelyContestant],
          inkwell: robinHoodTimelyContestant.cost - 3,
          deck: 2,
        },
        {
          play: [{ card: goofyKnightForADay, damage: 2 }],
        },
      );

      const result = testEngine.asPlayerOne().playCard(robinHoodTimelyContestant);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robinHoodTimelyContestant)).toBe("hand");
    });
  });

  describe("Ward", () => {
    it("has Ward keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [robinHoodTimelyContestant],
      });

      const card = testEngine.getCardModel(robinHoodTimelyContestant);
      expect(card.hasWard()).toBe(true);
    });
  });
});
