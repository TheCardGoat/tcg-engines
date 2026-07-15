import { describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { wendyDarlingCourageousCaptain } from "./108-wendy-darling-courageous-captain";
import { stitchAlienBuccaneer } from "./072-stitch-alien-buccaneer";

const nonPirateCharacter = createMockCharacter({
  id: "wendy-test-non-pirate",
  name: "Non-Pirate Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Wendy Darling - Courageous Captain", () => {
  describe("Evasive (Only characters with Evasive can challenge this character.)", () => {
    it("has Evasive ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [wendyDarlingCourageousCaptain],
      });

      const cardUnderTest = testEngine.getCardModel(wendyDarlingCourageousCaptain);
      expect(cardUnderTest.hasEvasive).toBe(true);
    });
  });

  describe("LOOK LIVELY, CREW! - While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.", () => {
    it("gets +1 {S} and +1 {L} when another Pirate character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingCourageousCaptain, stitchAlienBuccaneer],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.strength + 1,
      );
      expect(testEngine.asPlayerOne().getCardLore(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.lore + 1,
      );
    });

    it("does not get bonus without another Pirate character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingCourageousCaptain],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.strength,
      );
      expect(testEngine.asPlayerOne().getCardLore(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.lore,
      );
    });

    it("does not get bonus when only a non-Pirate character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingCourageousCaptain, nonPirateCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.strength,
      );
      expect(testEngine.asPlayerOne().getCardLore(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.lore,
      );
    });

    it("gains bonus after playing another Pirate character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingCourageousCaptain],
        hand: [stitchAlienBuccaneer],
        inkwell: stitchAlienBuccaneer.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.strength,
      );
      expect(testEngine.asPlayerOne().getCardLore(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.lore,
      );

      expect(testEngine.asPlayerOne().playCard(stitchAlienBuccaneer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.strength + 1,
      );
      expect(testEngine.asPlayerOne().getCardLore(wendyDarlingCourageousCaptain)).toBe(
        wendyDarlingCourageousCaptain.lore + 1,
      );
    });
  });
});
