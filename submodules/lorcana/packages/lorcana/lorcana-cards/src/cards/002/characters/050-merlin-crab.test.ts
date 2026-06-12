import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { merlinCrab } from "./050-merlin-crab";
import { letItGo } from "../../001/actions/163-let-it-go";

const targetCharacter = createMockCharacter({
  id: "merlin-crab-target",
  name: "Target Character",
  cost: 1,
  strength: 2,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "merlin-crab-opponent-char",
  name: "Opponent Character",
  cost: 1,
  strength: 2,
  willpower: 3,
});

describe("Merlin - Crab", () => {
  describe("READY OR NOT! - When you play this character and when he leaves play, chosen character gains Challenger +3 this turn", () => {
    it("should give Challenger +3 to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: merlinCrab.cost,
          hand: [merlinCrab],
          play: [targetCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(merlinCrab)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinCrab, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(targetCharacter, "Challenger")).toBe(3);
    });

    it("should allow choosing opponent's character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: merlinCrab.cost,
          hand: [merlinCrab],
          deck: 5,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(merlinCrab)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinCrab, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().hasKeyword(opponentCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerTwo().getKeywordValue(opponentCharacter, "Challenger")).toBe(3);
    });

    it("should give Challenger +3 to chosen character when Merlin leaves play via put-into-inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinCrab, targetCharacter],
          deck: 5,
        },
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(letItGo, { targets: [merlinCrab] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinCrab)).toBe("inkwell");

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinCrab, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().hasKeyword(opponentCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerTwo().getKeywordValue(opponentCharacter, "Challenger")).toBe(3);
    });

    it("should not have Challenger before trigger resolves", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: merlinCrab.cost,
          hand: [merlinCrab],
          play: [targetCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Challenger")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(merlinCrab)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Challenger")).toBe(false);

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinCrab, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Challenger")).toBe(true);
    });
  });
});
