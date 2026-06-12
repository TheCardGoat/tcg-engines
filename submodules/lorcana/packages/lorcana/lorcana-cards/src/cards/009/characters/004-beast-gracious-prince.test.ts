import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastGraciousPrince } from "./004-beast-gracious-prince";
import { arielOnHumanLegs } from "../../001/characters/001-ariel-on-human-legs";
import { aladdinStreetRat } from "../../001/characters/105-aladdin-street-rat";

describe("Beast - Gracious Prince", () => {
  describe("FULL DANCE CARD — Your Princess characters get +1 {S} and +1 {W}.", () => {
    it("gives +1 strength and +1 willpower to a Princess character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: beastGraciousPrince },
          { card: arielOnHumanLegs }, // Princess
        ],
      });

      const princessId = testEngine.findCardInstanceId(arielOnHumanLegs, "play");

      expect(testEngine.asServer().getCard(princessId).strength).toBe(
        arielOnHumanLegs.strength + 1,
      );
      expect(testEngine.asServer().getCard(princessId).willpower).toBe(
        arielOnHumanLegs.willpower + 1,
      );
    });

    it("does not buff a non-Princess character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: beastGraciousPrince },
          { card: aladdinStreetRat }, // Not a Princess
        ],
      });

      const nonPrincessId = testEngine.findCardInstanceId(aladdinStreetRat, "play");

      expect(testEngine.asServer().getCard(nonPrincessId).strength).toBe(aladdinStreetRat.strength);
      expect(testEngine.asServer().getCard(nonPrincessId).willpower).toBe(
        aladdinStreetRat.willpower,
      );
    });

    it("does not buff Beast himself (he is a Prince, not a Princess)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: beastGraciousPrince }],
      });

      const beastId = testEngine.findCardInstanceId(beastGraciousPrince, "play");

      expect(testEngine.asServer().getCard(beastId).strength).toBe(beastGraciousPrince.strength);
      expect(testEngine.asServer().getCard(beastId).willpower).toBe(beastGraciousPrince.willpower);
    });
  });
});
