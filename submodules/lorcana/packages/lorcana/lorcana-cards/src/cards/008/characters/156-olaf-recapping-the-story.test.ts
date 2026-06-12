import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { olafRecappingTheStory } from "./156-olaf-recapping-the-story";

const opposingCharacter = createMockCharacter({
  id: "olaf-target",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

const ownCharacter = createMockCharacter({
  id: "olaf-own",
  name: "Own Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Olaf - Recapping the Story", () => {
  describe("ENDLESS TALE - When you play this character, chosen opposing character gets -1 {S} this turn.", () => {
    it("reduces chosen opposing character's strength by 1 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: olafRecappingTheStory.cost,
          hand: [olafRecappingTheStory],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafRecappingTheStory)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafRecappingTheStory, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 1,
      );
    });

    it("strength reduction expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: olafRecappingTheStory.cost,
          hand: [olafRecappingTheStory],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafRecappingTheStory)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafRecappingTheStory, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength,
      );
    });

    it("cannot target own characters (opposing only)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: olafRecappingTheStory.cost,
          hand: [olafRecappingTheStory],
          play: [ownCharacter],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafRecappingTheStory)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafRecappingTheStory, { targets: [ownCharacter] }),
      ).not.toBeSuccessfulCommand();
    });
  });
});
