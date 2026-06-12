import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { percyPupsicle } from "./027-percy-pupsicle";

const mockOpponent = createMockCharacter({
  id: "percy-test-opponent",
  name: "Test Opponent",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Percy - Pupsicle", () => {
  describe("ICE BATH - This character can't challenge", () => {
    it("card model reports canChallenge as false due to static restriction", () => {
      const testEngine = new LorcanaTestEngine({
        play: [percyPupsicle],
      });

      const cardUnderTest = testEngine.getCardModel(percyPupsicle);
      expect(cardUnderTest.canChallenge()).toBe(false);
    });

    it("cannot challenge an exerted opponent character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [percyPupsicle],
          deck: 2,
        },
        {
          play: [{ card: mockOpponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().canChallenge(percyPupsicle, mockOpponent)).toBe(false);
    });

    it("does not deal damage when attempting to challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [percyPupsicle],
          deck: 2,
        },
        {
          play: [{ card: mockOpponent, exerted: true }],
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().challenge(percyPupsicle, mockOpponent);
      expect(result).not.toBeSuccessfulCommand();

      // No damage should be dealt because Percy can't challenge
      expect(testEngine.asPlayerTwo().getDamage(mockOpponent)).toBe(0);
    });

    it("can be challenged by opponent when exerted and takes damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: percyPupsicle, exerted: true }],
          deck: 2,
        },
        {
          play: [mockOpponent],
          deck: 2,
        },
      );

      // Pass turn so player two has priority and can attempt challenges
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().canChallenge(mockOpponent, percyPupsicle)).toBe(true);

      expect(
        testEngine.asPlayerTwo().challenge(mockOpponent, percyPupsicle),
      ).toBeSuccessfulCommand();

      // Percy should take damage equal to opponent's strength
      expect(testEngine.asPlayerOne().getDamage(percyPupsicle)).toBe(mockOpponent.strength);
    });
  });
});
