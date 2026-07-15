import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { faunaGoodnaturedFairy } from "./140-fauna-good-natured-fairy";

const supportTarget = createMockCharacter({
  id: "fauna-support-target",
  name: "Support Target",
  strength: 1,
  willpower: 4,
  cost: 2,
});

describe("Fauna - Good-Natured Fairy", () => {
  describe("Support - Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.", () => {
    it("should have Support ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [faunaGoodnaturedFairy],
      });

      const cardUnderTest = testEngine.getCardModel(faunaGoodnaturedFairy);
      expect(cardUnderTest.hasSupport()).toBe(true);
    });

    it("adds Fauna's strength to chosen character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: faunaGoodnaturedFairy, isDrying: false }, supportTarget],
      });

      expect(testEngine.asPlayerOne().quest(faunaGoodnaturedFairy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(faunaGoodnaturedFairy, {
          resolveOptional: true,
          targets: [supportTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
        supportTarget.strength + faunaGoodnaturedFairy.strength,
      );
    });

    it("strength bonus lasts only until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: faunaGoodnaturedFairy, isDrying: false }, supportTarget],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(faunaGoodnaturedFairy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(faunaGoodnaturedFairy, {
          resolveOptional: true,
          targets: [supportTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
        supportTarget.strength + faunaGoodnaturedFairy.strength,
      );

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
    });
  });
});
