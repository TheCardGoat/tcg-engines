import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { theDodoOutlandishStoryteller } from "./126-the-dodo-outlandish-storyteller";

describe("The Dodo - Outlandish Storyteller", () => {
  describe("EXTRAORDINARY SITUATION - This character gets +1 {S} for each 1 damage on him.", () => {
    it("has base strength of 0 when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theDodoOutlandishStoryteller],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(theDodoOutlandishStoryteller)).toBe(0);
    });

    it("gets +1 strength for each damage on him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theDodoOutlandishStoryteller, damage: 3 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(theDodoOutlandishStoryteller)).toBe(3);
    });

    it("gets +1 strength for 1 damage on him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theDodoOutlandishStoryteller, damage: 1 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(theDodoOutlandishStoryteller)).toBe(1);
    });
  });
});
