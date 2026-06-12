import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { johnSmithSnowTracker } from "./015-john-smith-snow-tracker";

describe("John Smith - Snow Tracker", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [johnSmithSnowTracker],
      inkwell: johnSmithSnowTracker.cost,
    });

    expect(testEngine.asPlayerOne().playCard(johnSmithSnowTracker)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(johnSmithSnowTracker)).toBe("play");
  });

  describe("FOLLOW THE TRACKS", () => {
    it("gains 1 lore at end of turn when exerted and no characters challenged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: johnSmithSnowTracker, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resolve the FOLLOW THE TRACKS bag effect
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(johnSmithSnowTracker),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not gain lore when this character is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [johnSmithSnowTracker],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // No bag effect should be created (character is not exerted)
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(johnSmithSnowTracker);
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does not gain lore when John Smith challenged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [johnSmithSnowTracker],
          deck: 2,
        },
        {
          play: [{ card: simbaProtectiveCub, exerted: true }],
          deck: 2,
        },
      );

      // John Smith challenges an opponent's exerted character (becomes exerted after challenging)
      expect(
        testEngine.asPlayerOne().challenge(johnSmithSnowTracker, simbaProtectiveCub),
      ).toBeSuccessfulCommand();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resolve any pending bag effects
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(johnSmithSnowTracker);
      }

      // Should not gain lore because John Smith challenged this turn
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does not gain lore when any of your characters challenged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: johnSmithSnowTracker, exerted: true }, mickeyMouseTrueFriend],
          deck: 2,
        },
        {
          play: [{ card: simbaProtectiveCub, exerted: true }],
          deck: 2,
        },
      );

      // A different character challenges (John Smith is already exerted)
      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, simbaProtectiveCub),
      ).toBeSuccessfulCommand();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resolve any pending bag effects
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(johnSmithSnowTracker);
      }

      // Should not gain lore because another character challenged this turn
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
