import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { nanisPayback } from "./127-nanis-payback";
import { goofyKnightForADay } from "../../002";
import { heiheiBoatSnack } from "../../001";

describe("Nani's Payback", () => {
  describe("Each opponent loses lore equal to the damage on chosen character of yours, to a maximum of 4 lore each. Draw a card.", () => {
    it("More than 4 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nanisPayback],
        inkwell: nanisPayback.cost,
        play: [goofyKnightForADay],
        deck: [heiheiBoatSnack],
      });

      testEngine.asServer().manualSetDamage(goofyKnightForADay, 5);
      testEngine.asServer().manualSetLore(PLAYER_TWO, 10);

      expect(
        testEngine.asPlayerOne().playCard(nanisPayback, {
          targets: [goofyKnightForADay],
        }).success,
      ).toBe(true);

      // Effect is capped at max of 4
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toEqual(10 - 4);
      expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("hand");
    });

    it("Less than 4 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nanisPayback],
        inkwell: nanisPayback.cost,
        play: [goofyKnightForADay],
      });

      testEngine.asServer().manualSetDamage(goofyKnightForADay, 3);
      testEngine.asServer().manualSetLore(PLAYER_TWO, 10);

      testEngine.asPlayerOne().playCard(nanisPayback, {
        targets: [goofyKnightForADay],
      });

      // Effect is capped at max of 4
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toEqual(10 - 3);
    });
  });
});
