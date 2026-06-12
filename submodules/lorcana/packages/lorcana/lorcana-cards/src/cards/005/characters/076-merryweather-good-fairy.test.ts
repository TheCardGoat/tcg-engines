import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { merryweatherGoodFairy } from "./076-merryweather-good-fairy";

const targetCharacter = createMockCharacter({
  id: "merryweather-target",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Merryweather - Good Fairy", () => {
  describe("RAY OF HOPE - When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.", () => {
    it("gives +2 strength to a chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [merryweatherGoodFairy],
          inkwell: merryweatherGoodFairy.cost + 1,
          play: [targetCharacter],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(merryweatherGoodFairy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merryweatherGoodFairy, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(5);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [merryweatherGoodFairy],
          inkwell: merryweatherGoodFairy.cost + 1,
          play: [targetCharacter],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(merryweatherGoodFairy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merryweatherGoodFairy, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(3);
    });
  });
});
