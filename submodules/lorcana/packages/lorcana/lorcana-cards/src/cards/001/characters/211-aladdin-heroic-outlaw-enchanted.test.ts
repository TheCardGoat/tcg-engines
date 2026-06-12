import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aladdinHeroicOutlawEnchanted } from "./211-aladdin-heroic-outlaw-enchanted";

const weakOpponent = createMockCharacter({
  id: "aladdin-enchanted-test-weak",
  name: "Weak Opponent",
  cost: 1,
  willpower: 1,
  strength: 1,
});

describe("Aladdin - Heroic Outlaw (Enchanted)", () => {
  describe("DARING EXPLOIT - During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.", () => {
    it("gains 2 lore and opponent loses 2 lore when Aladdin banishes a character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [aladdinHeroicOutlawEnchanted],
          lore: 1,
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
          lore: 3,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);

      expect(
        testEngine.asPlayerOne().challenge(aladdinHeroicOutlawEnchanted, weakOpponent),
      ).toBeSuccessfulCommand();

      // Aladdin (5 strength) banishes weak opponent (1 willpower) in a challenge
      // DARING EXPLOIT triggers: gain 2 lore + opponent loses 2 lore
      // Player one: 1 + 2 = 3
      // Player two: 3 - 2 = 1
      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    });

    it("does not trigger when opponent's character banishes in a challenge (during opponent's turn)", () => {
      const strongOpponent = createMockCharacter({
        id: "aladdin-enchanted-test-strong",
        name: "Strong Opponent",
        cost: 3,
        willpower: 10,
        strength: 10,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: aladdinHeroicOutlawEnchanted, exerted: true }],
          lore: 1,
        },
        {
          play: [strongOpponent],
          lore: 3,
        },
      );

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      // Player two challenges exerted Aladdin -- this banishes Aladdin, not the other way around
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, aladdinHeroicOutlawEnchanted),
      ).toBeSuccessfulCommand();

      // DARING EXPLOIT should NOT trigger (not during Aladdin's controller's turn, and Aladdin is not banishing)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not trigger when Aladdin does not banish the defender", () => {
      const toughOpponent = createMockCharacter({
        id: "aladdin-enchanted-test-tough",
        name: "Tough Opponent",
        cost: 3,
        willpower: 10,
        strength: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [aladdinHeroicOutlawEnchanted],
          lore: 0,
        },
        {
          play: [{ card: toughOpponent, exerted: true }],
          lore: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(aladdinHeroicOutlawEnchanted, toughOpponent),
      ).toBeSuccessfulCommand();

      // Aladdin (5 strength) does not banish tough opponent (10 willpower)
      // DARING EXPLOIT should NOT trigger
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });
  });
});
