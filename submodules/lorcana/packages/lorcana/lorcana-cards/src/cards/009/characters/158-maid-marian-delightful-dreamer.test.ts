import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maidMarianDelightfulDreamer } from "./158-maid-marian-delightful-dreamer";

const opposingCharacter = createMockCharacter({
  id: "maid-marian-009-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const ownCharacter = createMockCharacter({
  id: "maid-marian-009-own",
  name: "Own Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Maid Marian - Delightful Dreamer (set 009)", () => {
  describe("HIGHBORN LADY — When you play this character, chosen character gets -2 {S} this turn.", () => {
    it("triggers when Maid Marian is played and creates a bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maidMarianDelightfulDreamer.cost,
          hand: [maidMarianDelightfulDreamer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(maidMarianDelightfulDreamer),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("reduces chosen opposing character's strength by 2 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maidMarianDelightfulDreamer.cost,
          hand: [maidMarianDelightfulDreamer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(
        testEngine.asPlayerOne().playCard(maidMarianDelightfulDreamer),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maidMarianDelightfulDreamer, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 2);
    });

    it("strength reduction expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maidMarianDelightfulDreamer.cost,
          hand: [maidMarianDelightfulDreamer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(
        testEngine.asPlayerOne().playCard(maidMarianDelightfulDreamer),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maidMarianDelightfulDreamer, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 2);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Strength should be restored
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore);
    });

    it("can also target own characters — ability allows any character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maidMarianDelightfulDreamer.cost,
          hand: [maidMarianDelightfulDreamer],
          play: [ownCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(ownCharacter);

      expect(
        testEngine.asPlayerOne().playCard(maidMarianDelightfulDreamer),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maidMarianDelightfulDreamer, { targets: [ownCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ownCharacter)).toBe(strengthBefore - 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(ownCharacter)).toBe(strengthBefore);
    });
  });
});
