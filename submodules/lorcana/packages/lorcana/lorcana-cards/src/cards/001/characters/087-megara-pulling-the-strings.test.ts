import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { megaraPullingTheStrings } from "./087-megara-pulling-the-strings";

const targetCharacter = createMockCharacter({
  id: "megara-test-target",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Megara - Pulling the Strings", () => {
  describe("WONDER BOY - When you play this character, chosen character gets +2 {S} this turn", () => {
    it("gives chosen character +2 strength this turn when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [megaraPullingTheStrings],
          inkwell: megaraPullingTheStrings.cost,
          play: [targetCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(3);

      expect(testEngine.asPlayerOne().playCard(megaraPullingTheStrings)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(megaraPullingTheStrings, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(5);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [megaraPullingTheStrings],
          inkwell: megaraPullingTheStrings.cost,
          play: [targetCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(megaraPullingTheStrings)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(megaraPullingTheStrings, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(5);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(3);
    });

    it("can target herself for the +2 strength bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [megaraPullingTheStrings],
          inkwell: megaraPullingTheStrings.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(megaraPullingTheStrings)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(megaraPullingTheStrings, {
          targets: [megaraPullingTheStrings],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(megaraPullingTheStrings)).toBe(4);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(megaraPullingTheStrings)).toBe(2);
    });

    it("can target opponent's character for the +2 strength bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [megaraPullingTheStrings],
          inkwell: megaraPullingTheStrings.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(3);

      expect(testEngine.asPlayerOne().playCard(megaraPullingTheStrings)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(megaraPullingTheStrings, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(5);
    });
  });
});
