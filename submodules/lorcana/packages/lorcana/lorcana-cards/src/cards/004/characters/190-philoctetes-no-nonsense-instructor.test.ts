import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { philoctetesNononsenseInstructor } from "./190-philoctetes-no-nonsense-instructor";
import { arielSingingMermaid } from "./003-ariel-singing-mermaid";
import { mirabelMadrigalProphecyFinder } from "./019-mirabel-madrigal-prophecy-finder";
import { pegasusGiftForHercules } from "./084-pegasus-gift-for-hercules";

describe("Philoctetes - No-Nonsense Instructor", () => {
  describe("YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1.", () => {
    it("should give Challenger +1 to Hero characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [philoctetesNononsenseInstructor, arielSingingMermaid],
        deck: 3,
      });

      // Ariel is a Hero character and should gain Challenger +1
      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: arielSingingMermaid,
        keyword: "Challenger",
        value: 1,
      });
    });

    it("should not give Challenger to Philoctetes himself (not a Hero)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [philoctetesNononsenseInstructor],
        deck: 3,
      });

      // Philoctetes is Storyborn/Ally, not a Hero - should not gain Challenger
      expect(testEngine.hasKeyword(philoctetesNononsenseInstructor, "Challenger")).toBe(false);
    });
  });

  describe("SHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.", () => {
    it("should gain 1 lore when playing a Hero character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: mirabelMadrigalProphecyFinder.cost,
        play: [philoctetesNononsenseInstructor],
        hand: [mirabelMadrigalProphecyFinder],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(mirabelMadrigalProphecyFinder),
      ).toBeSuccessfulCommand();

      // The triggered ability auto-resolves for mandatory no-target gain-lore effects
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("should not gain lore when playing a non-Hero character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: pegasusGiftForHercules.cost,
        play: [philoctetesNononsenseInstructor],
        hand: [pegasusGiftForHercules],
        deck: 3,
      });

      // Pegasus is Storyborn/Ally - not a Hero classification - should not trigger
      expect(testEngine.asPlayerOne().playCard(pegasusGiftForHercules)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
