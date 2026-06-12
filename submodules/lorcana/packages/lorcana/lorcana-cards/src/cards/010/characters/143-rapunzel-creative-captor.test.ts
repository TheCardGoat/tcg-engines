import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelCreativeCaptor } from "./143-rapunzel-creative-captor";

const opposingCharacter = createMockCharacter({
  id: "rapunzel-creative-captor-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const ownCharacter = createMockCharacter({
  id: "rapunzel-creative-captor-own",
  name: "Own Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Rapunzel - Creative Captor", () => {
  describe("ENSNARL - When you play this character, chosen opposing character gets -3 {S} this turn.", () => {
    it("reduces the chosen opposing character's strength by 3 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rapunzelCreativeCaptor],
          inkwell: rapunzelCreativeCaptor.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(rapunzelCreativeCaptor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rapunzelCreativeCaptor, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 3,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength,
      );
    });

    it("cannot target own characters (only opposing)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rapunzelCreativeCaptor],
          inkwell: rapunzelCreativeCaptor.cost,
          play: [ownCharacter],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(rapunzelCreativeCaptor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Attempting to target own character should fail
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rapunzelCreativeCaptor, { targets: [ownCharacter] }),
      ).not.toBeSuccessfulCommand();
    });

    it("fizzles when there are no opposing characters to target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rapunzelCreativeCaptor],
        inkwell: rapunzelCreativeCaptor.cost,
      });

      expect(testEngine.asPlayerOne().playCard(rapunzelCreativeCaptor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(rapunzelCreativeCaptor)).toBe("play");
    });
  });
});
