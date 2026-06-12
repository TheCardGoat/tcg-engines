import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { aliceWellreadWhisper } from "./036-alice-well-read-whisper";
import { pocahontasFollowingTheWind } from "./042-pocahontas-following-the-wind";
import { davidProtectiveSnowboarder } from "./009-david-protective-snowboarder";

describe("David - Protective Snowboarder", () => {
  describe("Bodyguard", () => {
    it("has Bodyguard ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [davidProtectiveSnowboarder],
      });

      expect(testEngine.getCardModel(davidProtectiveSnowboarder).hasBodyguard()).toBe(true);
    });

    it("can be played ready (standard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [davidProtectiveSnowboarder],
        inkwell: davidProtectiveSnowboarder.cost,
      });

      expect(testEngine.asPlayerOne().playCard(davidProtectiveSnowboarder)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(davidProtectiveSnowboarder)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(davidProtectiveSnowboarder)).toBe(false);
    });

    it("can enter play exerted (optional Bodyguard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [davidProtectiveSnowboarder],
        inkwell: davidProtectiveSnowboarder.cost,
      });

      expect(
        testEngine.asPlayerOne().playCardOptional(davidProtectiveSnowboarder, true),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(davidProtectiveSnowboarder)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(davidProtectiveSnowboarder)).toBe(true);
    });

    it("opponent must challenge Bodyguard first if able", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: davidProtectiveSnowboarder, exerted: true },
            { card: aliceWellreadWhisper, exerted: true },
          ],
        },
        {
          play: [{ card: pocahontasFollowingTheWind, exerted: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Challenging a non-Bodyguard character while Bodyguard is available must fail
      const failResult = testEngine
        .asPlayerTwo()
        .challenge(pocahontasFollowingTheWind, aliceWellreadWhisper);
      expect(failResult.success).toBe(false);

      // Challenging the Bodyguard character must succeed
      expect(
        testEngine.asPlayerTwo().challenge(pocahontasFollowingTheWind, davidProtectiveSnowboarder),
      ).toBeSuccessfulCommand();
    });
  });
});
