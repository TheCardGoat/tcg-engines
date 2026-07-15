import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sarabiProtectingThePride } from "./012-sarabi-protecting-the-pride";

const opposingCharacter = createMockCharacter({
  id: "sarabi-opposing-target",
  name: "Opposing Target Character",
  cost: 2,
  strength: 6,
  willpower: 4,
});

const lowStrengthCharacter = createMockCharacter({
  id: "sarabi-low-strength-target",
  name: "Low Strength Target",
  cost: 1,
  strength: 3,
  willpower: 2,
});

describe("Sarabi - Protecting the Pride", () => {
  describe("FEARSOME SNARL — {E} Chosen opposing character gets -4 {S} until the start of your next turn", () => {
    it("reduces chosen opposing character's strength by 4", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [sarabiProtectingThePride] },
        { play: [opposingCharacter] },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);
      expect(strengthBefore).toBe(6);

      expect(
        testEngine.asPlayerOne().activateAbility(sarabiProtectingThePride, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(2);
    });

    it("exerts Sarabi as the cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [sarabiProtectingThePride] },
        { play: [opposingCharacter] },
      );

      expect(testEngine.isExerted(sarabiProtectingThePride)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(sarabiProtectingThePride, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(sarabiProtectingThePride)).toBe(true);
    });

    it("strength reduction persists through opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [sarabiProtectingThePride], deck: 1 },
        { play: [opposingCharacter], deck: 1 },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);
      expect(strengthBefore).toBe(6);

      expect(
        testEngine.asPlayerOne().activateAbility(sarabiProtectingThePride, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(2);
    });

    it.todo("strength reduction expires at the start of controller's next turn — requires engine support for 'until-start-of-next-turn' duration on modify-stat activated abilities", () => {});

    it("can reduce strength below base (floor handled by engine)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [sarabiProtectingThePride] },
        { play: [lowStrengthCharacter] },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(lowStrengthCharacter);
      expect(strengthBefore).toBe(3);

      expect(
        testEngine.asPlayerOne().activateAbility(sarabiProtectingThePride, {
          targets: [lowStrengthCharacter],
        }),
      ).toBeSuccessfulCommand();

      const resultStrength = testEngine.asPlayerTwo().getCardStrength(lowStrengthCharacter);
      expect(resultStrength).toBeLessThanOrEqual(0);
    });
  });
});
