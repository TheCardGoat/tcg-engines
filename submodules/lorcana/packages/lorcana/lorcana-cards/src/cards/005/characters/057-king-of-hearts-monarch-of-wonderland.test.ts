import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kingOfHeartsMonarchOfWonderland } from "./057-king-of-hearts-monarch-of-wonderland";

const opponentCharacter = createMockCharacter({
  id: "opp-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("King of Hearts - Monarch of Wonderland", () => {
  describe("PLEASING THE QUEEN — {E} — Chosen exerted character can't ready at the start of their next turn.", () => {
    it("applies cant-ready restriction to a chosen exerted character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingOfHeartsMonarchOfWonderland],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Activate the PLEASING THE QUEEN ability targeting the exerted opponent character
      expect(
        testEngine.asPlayerOne().activateAbility(kingOfHeartsMonarchOfWonderland, {
          ability: "PLEASING THE QUEEN",
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The opponent character should have the cant-ready restriction
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      // Pass player one's turn — at start of player two's turn, the character should NOT ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("removes the cant-ready restriction after the target player's turn starts", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingOfHeartsMonarchOfWonderland],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(kingOfHeartsMonarchOfWonderland, {
          ability: "PLEASING THE QUEEN",
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During player two's turn the restriction should still be on
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      // Pass player two's turn — at start of player one's next turn the restriction should be gone
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });

    it("exerts King of Hearts when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingOfHeartsMonarchOfWonderland],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.isExerted(kingOfHeartsMonarchOfWonderland)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(kingOfHeartsMonarchOfWonderland, {
          ability: "PLEASING THE QUEEN",
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(kingOfHeartsMonarchOfWonderland)).toBe(true);
    });
  });
});
