import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { shereKhanMenacingPredator } from "./104-shere-khan-menacing-predator";

const attacker = createMockCharacter({
  id: "test-attacker",
  name: "Test Attacker",
  cost: 2,
  strength: 4,
  willpower: 3,
  lore: 1,
});

const defender = createMockCharacter({
  id: "test-defender",
  name: "Test Defender",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("Shere Khan - Menacing Predator (Set 9)", () => {
  describe("DON'T INSULT MY INTELLIGENCE - Whenever one of your characters challenges another character, gain 1 lore.", () => {
    it("gains 1 lore when another of your characters challenges an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: shereKhanMenacingPredator, isDrying: false },
            { card: attacker, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 0,
          },
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("gains 1 lore when Shere Khan himself challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shereKhanMenacingPredator, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 0,
          },
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(shereKhanMenacingPredator, defender),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
