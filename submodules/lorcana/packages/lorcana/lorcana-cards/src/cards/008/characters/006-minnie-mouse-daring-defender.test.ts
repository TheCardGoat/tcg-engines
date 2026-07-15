import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { minnieMouseDaringDefender } from "./006-minnie-mouse-daring-defender";

describe("Minnie Mouse - Daring Defender", () => {
  describe("Bodyguard", () => {
    it("has Bodyguard keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [minnieMouseDaringDefender],
      });

      const cardUnderTest = testEngine.getCardModel(minnieMouseDaringDefender);
      expect(cardUnderTest.hasBodyguard()).toBe(true);
    });
  });

  describe("TRUE VALOR - This character gets +1 {S} for each 1 damage on her.", () => {
    it("has base strength of 0 when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [minnieMouseDaringDefender],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseDaringDefender)).toBe(0);
    });

    it("gets +1 strength for each damage on her", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: minnieMouseDaringDefender, damage: 2 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseDaringDefender)).toBe(2);
    });

    it("gets +1 strength for 1 damage on her", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: minnieMouseDaringDefender, damage: 1 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseDaringDefender)).toBe(1);
    });
  });
});
