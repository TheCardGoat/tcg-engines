import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasBaby } from "./046-jetsam-ursulas-baby";
import { flotsamUrsulasBaby } from "./043-flotsam-ursulas-baby";

// Jetsam: strength 2, willpower 4
// Flotsam: strength 4, willpower 2

// A defender that Jetsam can challenge (exerted, willpower <= 2+2=4 so Jetsam kills it when Challenger +2)
const weakDefender = createMockCharacter({
  id: "jetsam-ub-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 3,
});

// A defender that Flotsam (str 4) with Challenger +2 = 6 strength can kill (willpower <= 6)
const moderateDefender = createMockCharacter({
  id: "jetsam-ub-moderate-defender",
  name: "Moderate Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe('Jetsam - Ursula\'s "Baby"', () => {
  describe("Challenger +2", () => {
    it("Jetsam has Challenger +2 while challenging", () => {
      // Jetsam (str 2 + challenger 2 = 4) vs weakDefender (wp 3) -> kills it
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jetsamUrsulasBaby, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(jetsamUrsulasBaby, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");
    });
  });

  describe("OMINOUS PAIR — Your characters named Flotsam gain Challenger +2", () => {
    it("Flotsam gains Challenger +2 when Jetsam is in play", () => {
      // Flotsam (str 4 + challenger 2 from Jetsam = 6) vs moderateDefender (wp 5) -> kills it
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: jetsamUrsulasBaby, isDrying: false },
            { card: flotsamUrsulasBaby, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: moderateDefender, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(flotsamUrsulasBaby, moderateDefender),
      ).toBeSuccessfulCommand();

      // moderateDefender (wp 5) should be banished by Flotsam with Challenger +2 (str 4+2=6)
      expect(testEngine.asPlayerTwo().getCardZone(moderateDefender)).toBe("discard");
    });

    it("Flotsam does not gain Challenger +2 when Jetsam is not in play", () => {
      // Flotsam (str 4, no Challenger bonus) vs moderateDefender (wp 5) -> Flotsam does NOT kill it
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: flotsamUrsulasBaby, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: moderateDefender, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(flotsamUrsulasBaby, moderateDefender),
      ).toBeSuccessfulCommand();

      // moderateDefender (wp 5) should survive Flotsam's base str 4 attack (no Challenger bonus)
      expect(testEngine.asPlayerTwo().getCardZone(moderateDefender)).toBe("play");
    });
  });
});
