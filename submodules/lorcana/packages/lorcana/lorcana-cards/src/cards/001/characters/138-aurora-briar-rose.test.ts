import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { auroraBriarRose } from "./138-aurora-briar-rose";

const targetCharacter = createMockCharacter({
  id: "aurora-test-target",
  name: "Target Character",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "aurora-test-another",
  name: "Another Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Aurora - Briar Rose", () => {
  describe("DISARMING BEAUTY - When you play this character, chosen character gets -2 {S} this turn.", () => {
    it("gives chosen character -2 strength this turn when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [auroraBriarRose],
          inkwell: auroraBriarRose.cost,
        },
        {
          play: [targetCharacter],
        },
      );

      const baseStrength = targetCharacter.strength;

      expect(testEngine.asPlayerOne().playCard(auroraBriarRose)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(auroraBriarRose, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(baseStrength - 2);
    });

    it("strength reduction expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [auroraBriarRose],
          inkwell: auroraBriarRose.cost,
        },
        {
          play: [targetCharacter],
        },
      );

      const baseStrength = targetCharacter.strength;

      expect(testEngine.asPlayerOne().playCard(auroraBriarRose)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(auroraBriarRose, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(baseStrength - 2);

      // Pass turn — effect should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(baseStrength);
    });

    it("can target own character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [auroraBriarRose],
        play: [targetCharacter],
        inkwell: auroraBriarRose.cost,
      });

      const baseStrength = targetCharacter.strength;

      expect(testEngine.asPlayerOne().playCard(auroraBriarRose)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(auroraBriarRose, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(baseStrength - 2);
    });
  });
});
