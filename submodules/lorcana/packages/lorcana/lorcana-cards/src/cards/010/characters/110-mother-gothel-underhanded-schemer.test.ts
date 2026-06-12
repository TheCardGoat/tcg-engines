import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { motherGothelUnderhandedSchemer } from "./110-mother-gothel-underhanded-schemer";

const strongAttacker = createMockCharacter({
  id: "mg-strong-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const weakDefender = createMockCharacter({
  id: "mg-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Mother Gothel - Underhanded Schemer", () => {
  describe("SOMEBODY'S GOT TO USE IT - If a character was banished this turn, this character gets +2 {S}.", () => {
    it("should have base strength when no character has been banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [motherGothelUnderhandedSchemer],
      });

      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(2);
    });

    it("should get +2 strength after a character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          // Strong attacker is dry (not fresh) so it can challenge
          play: [motherGothelUnderhandedSchemer, { card: strongAttacker, exerted: false }],
        },
        {
          deck: 2,
          // Weak defender must be exerted to be challenged
          play: [{ card: weakDefender, exerted: true }],
        },
      );

      // Before banishment
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(2);

      // Challenge: strongAttacker (5/5) vs weakDefender (1/1) — weakDefender is banished
      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, weakDefender),
      ).toBeSuccessfulCommand();

      // After banishment — Mother Gothel should get +2 strength
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(4);
    });

    it("should lose +2 strength bonus after the turn passes", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [motherGothelUnderhandedSchemer, { card: strongAttacker, exerted: false }],
        },
        {
          deck: 2,
          play: [{ card: weakDefender, exerted: true }],
        },
      );

      // Challenge to banish
      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, weakDefender),
      ).toBeSuccessfulCommand();

      // Verify strength bonus is active
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(4);

      // Pass turn to opponent
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Pass back to player one (start of next turn)
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Bonus should be gone — back to base strength
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(2);
    });

    it("should still only get +2 when multiple characters are banished (not stacking)", () => {
      const weakDefender2 = createMockCharacter({
        id: "mg-weak-defender-2",
        name: "Weak Defender 2",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const strongAttacker2 = createMockCharacter({
        id: "mg-strong-attacker-2",
        name: "Strong Attacker 2",
        cost: 3,
        strength: 5,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [
            motherGothelUnderhandedSchemer,
            { card: strongAttacker, exerted: false },
            { card: strongAttacker2, exerted: false },
          ],
        },
        {
          deck: 2,
          play: [
            { card: weakDefender, exerted: true },
            { card: weakDefender2, exerted: true },
          ],
        },
      );

      // Before any banishment
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(2);

      // Banish first character
      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, weakDefender),
      ).toBeSuccessfulCommand();

      // After first banishment
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(4);

      // Banish second character
      expect(
        testEngine.asPlayerOne().challenge(strongAttacker2, weakDefender2),
      ).toBeSuccessfulCommand();

      // Still +2, not +4 — the bonus is fixed at +2 regardless of banish count
      expect(testEngine.asPlayerOne().getCardStrength(motherGothelUnderhandedSchemer)).toBe(4);
    });
  });
});
