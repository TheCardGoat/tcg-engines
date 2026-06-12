import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { patchIntimidatingPup } from "./014-patch-intimidating-pup";

const targetCharacter = createMockCharacter({
  id: "patch-test-target",
  name: "Target Character",
  cost: 2,
  strength: 4,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "patch-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 4,
  willpower: 3,
});

describe("Patch - Intimidating Pup", () => {
  describe("BARK - {E} -- Chosen character gets -2 {S} until the start of your next turn.", () => {
    it("gives chosen character -2 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [patchIntimidatingPup, targetCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(4);

      expect(
        testEngine.asPlayerOne().activateAbility(patchIntimidatingPup, {
          ability: "BARK",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(2);
    });

    it("exerts Patch when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [patchIntimidatingPup, targetCharacter],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(patchIntimidatingPup, {
          ability: "BARK",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(patchIntimidatingPup)).toBe(true);
    });

    it("can target opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [patchIntimidatingPup],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(patchIntimidatingPup, {
          ability: "BARK",
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacter)).toBe(2);
    });

    it("-2 strength lasts until the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [patchIntimidatingPup],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(patchIntimidatingPup, {
          ability: "BARK",
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Effect is active during player one's turn
      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacter)).toBe(2);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Effect should still be active during player two's turn
      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacter)).toBe(2);

      // Pass player two's turn (start of player one's next turn) - effect should expire
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacter)).toBe(4);
    });
  });
});
