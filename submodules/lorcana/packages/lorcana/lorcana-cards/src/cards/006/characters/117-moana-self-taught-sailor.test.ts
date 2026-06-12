import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { moanaSelftaughtSailor } from "./117-moana-self-taught-sailor";

const opponent = createMockCharacter({
  id: "moana-test-opponent",
  name: "Test Opponent",
  cost: 5,
  strength: 4,
  willpower: 6,
});

const captainCharacter = createMockCharacter({
  id: "moana-test-captain",
  name: "Test Captain",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Captain"],
});

describe("Moana - Self-Taught Sailor", () => {
  describe("LEARNING THE ROPES - This character can't challenge unless you have a Captain character in play.", () => {
    it("cannot challenge when no Captain is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: moanaSelftaughtSailor, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().canChallenge(moanaSelftaughtSailor, opponent)).toBe(false);

      const result = testEngine.asPlayerOne().challenge(moanaSelftaughtSailor, opponent);
      expect(result.success).toBe(false);
    });

    it("can challenge when a Captain character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: moanaSelftaughtSailor, isDrying: false },
            { card: captainCharacter, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().canChallenge(moanaSelftaughtSailor, opponent)).toBe(true);

      const result = testEngine.asPlayerOne().challenge(moanaSelftaughtSailor, opponent);
      expect(result.success).toBe(true);
    });

    it("Moana is banished when challenging a stronger character with a Captain in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: moanaSelftaughtSailor, isDrying: false },
            { card: captainCharacter, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(moanaSelftaughtSailor, opponent),
      ).toBeSuccessfulCommand();

      // Moana (3 STR / 2 WP) vs Opponent (4 STR / 6 WP)
      // Opponent takes 3 damage (not banished, 6 WP)
      // Moana takes 4 damage (banished, 2 WP)
      expect(testEngine.asPlayerOne().getCardZone(moanaSelftaughtSailor)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(opponent)).toBe("play");
      expect(testEngine.asPlayerTwo().getDamage(opponent)).toBe(3);
    });
  });
});
