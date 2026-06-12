import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { doloresMadrigalWithinEarshot } from "./078-dolores-madrigal-within-earshot";
import { marianoGuzmanHandsomeSuitor } from "./016-mariano-guzman-handsome-suitor";

describe("Mariano Guzman - Handsome Suitor", () => {
  describe("I SEE YOU - While you have a character named Dolores Madrigal in play, this character gets +1 {L}.", () => {
    it("should have base lore of 1 when Dolores Madrigal is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [marianoGuzmanHandsomeSuitor],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(marianoGuzmanHandsomeSuitor)).toBe(1);
    });

    it("should have derived lore of 2 when Dolores Madrigal is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [marianoGuzmanHandsomeSuitor, doloresMadrigalWithinEarshot],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(marianoGuzmanHandsomeSuitor)).toBe(2);
    });

    it("should gain 1 lore when questing without Dolores Madrigal in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [marianoGuzmanHandsomeSuitor],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(marianoGuzmanHandsomeSuitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });

    it("should gain 2 lore when questing with Dolores Madrigal in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [marianoGuzmanHandsomeSuitor, doloresMadrigalWithinEarshot],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(marianoGuzmanHandsomeSuitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    });
  });
});
