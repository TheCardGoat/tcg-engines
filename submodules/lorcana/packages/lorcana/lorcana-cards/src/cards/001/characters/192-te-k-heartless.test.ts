import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { teKHeartless } from "./192-te-k-heartless";

const weakOpponent = createMockCharacter({
  id: "teka-test-weak",
  name: "Weak Opponent",
  cost: 1,
  willpower: 1,
  strength: 1,
});

const toughOpponent = createMockCharacter({
  id: "teka-test-tough",
  name: "Tough Opponent",
  cost: 3,
  willpower: 10,
  strength: 1,
});

describe("Te Kā - Heartless", () => {
  describe("SEEK THE HEART - During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.", () => {
    it("gains 2 lore when Te Kā banishes a character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKHeartless],
          lore: 0,
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(teKHeartless, weakOpponent),
      ).toBeSuccessfulCommand();

      // Te Kā (5 strength) banishes weak opponent (1 willpower) in a challenge
      // SEEK THE HEART triggers: gain 2 lore
      // Player one: 0 + 2 = 2
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does not trigger when Te Kā does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKHeartless],
          lore: 0,
        },
        {
          play: [{ card: toughOpponent, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(teKHeartless, toughOpponent),
      ).toBeSuccessfulCommand();

      // Te Kā (5 strength) does not banish tough opponent (10 willpower)
      // SEEK THE HEART should NOT trigger
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
