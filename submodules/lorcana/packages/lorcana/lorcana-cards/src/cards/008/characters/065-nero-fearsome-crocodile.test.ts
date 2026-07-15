import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { neroFearsomeCrocodile } from "./065-nero-fearsome-crocodile";

const opponent = createMockCharacter({
  id: "nero-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Nero - Fearsome Crocodile", () => {
  describe("AND MEAN - {E} - Move 1 damage counter from this character to chosen opposing character.", () => {
    it("moves 1 damage from self to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: neroFearsomeCrocodile, damage: 2 }],
          deck: 1,
        },
        {
          play: [opponent],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().getDamage(neroFearsomeCrocodile)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opponent)).toBe(0);

      const result = testEngine.asPlayerOne().activateAbility(neroFearsomeCrocodile, {
        targets: [opponent],
      });

      expect(result).toBeSuccessfulCommand();

      // Nero should have 1 less damage (2 - 1 = 1)
      expect(testEngine.asPlayerOne().getDamage(neroFearsomeCrocodile)).toBe(1);
      // Opponent should have 1 damage moved to it
      expect(testEngine.asPlayerTwo().getDamage(opponent)).toBe(1);
      // Nero should be exerted (exert cost)
      expect(testEngine.asPlayerOne().isExerted(neroFearsomeCrocodile)).toBe(true);
    });

    it("does not move damage if Nero has no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [neroFearsomeCrocodile],
          deck: 1,
        },
        {
          play: [opponent],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(neroFearsomeCrocodile, {
        targets: [opponent],
      });

      expect(result).toBeSuccessfulCommand();

      // No damage to move
      expect(testEngine.asPlayerOne().getDamage(neroFearsomeCrocodile)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opponent)).toBe(0);
    });

    it("cannot activate if already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: neroFearsomeCrocodile, damage: 2, exerted: true }],
          deck: 1,
        },
        {
          play: [opponent],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(neroFearsomeCrocodile, {
        targets: [opponent],
      });

      expect(result).not.toBeSuccessfulCommand();
    });
  });
});
