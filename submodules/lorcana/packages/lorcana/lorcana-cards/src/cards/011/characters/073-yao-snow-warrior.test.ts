import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yaoSnowWarrior } from "./073-yao-snow-warrior";

const opponentAttacker = createMockCharacter({
  id: "yao-test-attacker",
  name: "Opponent Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Yao - Snow Warrior", () => {
  describe("OOH, I'M SCARED - During opponents' turns, this character gains Resist +2", () => {
    it("should have Resist +2 during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yaoSnowWarrior],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // During own turn: no Resist
      expect(testEngine.asPlayerOne().hasKeyword(yaoSnowWarrior, "Resist")).toBe(false);

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During opponent's turn: should have Resist +2
      expect(testEngine.asPlayerOne().hasKeyword(yaoSnowWarrior, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(yaoSnowWarrior, "Resist")).toBe(2);
    });

    it("should NOT have Resist during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yaoSnowWarrior],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // During own turn: no Resist
      expect(testEngine.asPlayerOne().hasKeyword(yaoSnowWarrior, "Resist")).toBe(false);

      // Pass to opponent's turn, then back to own
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Back to own turn: no Resist again
      expect(testEngine.asPlayerOne().hasKeyword(yaoSnowWarrior, "Resist")).toBe(false);
    });

    it("should reduce damage taken during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: yaoSnowWarrior, exerted: true }],
          deck: 5,
        },
        {
          play: [opponentAttacker],
          deck: 5,
        },
      );

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Yao (4 strength attack - 2 Resist = 2 damage)
      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, yaoSnowWarrior),
      ).toBeSuccessfulCommand();

      // Yao has 3 willpower, took 4 - 2 = 2 damage (Resist +2 reduces by 2)
      expect(testEngine.asPlayerOne().getDamage(yaoSnowWarrior)).toBe(2);
      // Should still be alive (2 damage < 3 willpower)
      expect(testEngine.asPlayerOne().getCardZone(yaoSnowWarrior)).toBe("play");
    });
  });
});
