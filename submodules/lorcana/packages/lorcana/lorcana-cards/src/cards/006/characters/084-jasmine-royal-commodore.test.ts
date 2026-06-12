import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jasmineRoyalCommodore } from "./084-jasmine-royal-commodore";
import { jasmineRoyalSeafarer } from "./070-jasmine-royal-seafarer";
import { jasmineRebelliousPrincess } from "./106-jasmine-rebellious-princess";

describe("Jasmine - Royal Commodore", () => {
  it("should have Shift 5 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jasmineRoyalCommodore],
    });

    expect(testEngine.hasKeyword(jasmineRoyalCommodore, "Shift")).toBe(true);
  });

  describe("RULER OF THE SEAS - When you play this character, if you used Shift to play her, return all other exerted characters to their players' hands.", () => {
    it("returns all other exerted characters to their players' hands when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jasmineRoyalCommodore.cost,
          hand: [jasmineRoyalCommodore],
          play: [
            jasmineRoyalSeafarer,
            { card: jasmineRebelliousPrincess, exerted: true, isDrying: false },
          ],
        },
        {
          play: [{ card: jasmineRebelliousPrincess, exerted: true, isDrying: false }],
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(jasmineRoyalSeafarer, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(jasmineRoyalCommodore, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Should auto-resolve (mandatory, non-optional triggered ability)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Exerted characters (excluding Jasmine Royal Commodore itself) should be returned to hand
      // Player one's exerted Jasmine Rebellious Princess -> returned to player one's hand
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 1, // Jasmine Rebellious Princess returned to hand
        play: 1, // Only Jasmine Royal Commodore (shifted on top of Jasmine Royal Seafarer)
      });

      // Player two's exerted Jasmine Rebellious Princess -> returned to player two's hand
      expect(testEngine.asPlayerTwo().getZonesCardCount()).toMatchObject({
        hand: 1, // Jasmine Rebellious Princess returned to hand
        play: 0,
      });
    });

    it("does not trigger when played normally without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jasmineRoyalCommodore.cost,
        hand: [jasmineRoyalCommodore],
        play: [{ card: jasmineRebelliousPrincess, exerted: true, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().playCard(jasmineRoyalCommodore)).toBeSuccessfulCommand();

      // The ability should not trigger at all when not played via Shift
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Exerted character should remain in play
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 0,
        play: 2, // Jasmine Royal Commodore + Jasmine Rebellious Princess (still exerted)
      });
    });

    it("does not return Jasmine Royal Commodore itself even if considered exerted after entering play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jasmineRoyalCommodore.cost,
        hand: [jasmineRoyalCommodore],
        play: [jasmineRoyalSeafarer],
      });

      const shiftTarget = testEngine.findCardInstanceId(jasmineRoyalSeafarer, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(jasmineRoyalCommodore, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Jasmine Royal Commodore should still be in play (not returned to hand)
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 0,
        play: 1, // Only Jasmine Royal Commodore remains
      });
    });
  });
});
