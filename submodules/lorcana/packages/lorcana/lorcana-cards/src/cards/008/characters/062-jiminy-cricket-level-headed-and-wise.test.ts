import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jiminyCricketLevelheadedAndWise } from "./062-jiminy-cricket-level-headed-and-wise";
import { monstroInfamousWhale } from "./064-monstro-infamous-whale";
import { peterPanShadowFinder } from "../../004/characters/054-peter-pan-shadow-finder";

const nonRushCharacter = createMockCharacter({
  id: "test-non-rush-character",
  name: "Non-Rush Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Jiminy Cricket - Level-Headed and Wise", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jiminyCricketLevelheadedAndWise],
      deck: 2,
    });

    expect(testEngine.hasKeyword(jiminyCricketLevelheadedAndWise, "Evasive")).toBe(true);
  });

  describe("ENOUGH'S ENOUGH - While this character is exerted, opposing characters with Rush enter play exerted.", () => {
    it("does NOT cause opposing Rush characters to enter play exerted when Jiminy is NOT exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [monstroInfamousWhale],
          inkwell: monstroInfamousWhale.cost,
          deck: 2,
        },
        {
          play: [jiminyCricketLevelheadedAndWise],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(monstroInfamousWhale)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(monstroInfamousWhale)).toBe(false);
    });

    it("causes opposing Rush characters to enter play exerted while Jiminy is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [monstroInfamousWhale],
          inkwell: monstroInfamousWhale.cost,
          deck: 2,
        },
        {
          play: [{ card: jiminyCricketLevelheadedAndWise, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(monstroInfamousWhale)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(monstroInfamousWhale)).toBe(true);
    });

    it("does not affect opposing non-Rush characters while Jiminy is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonRushCharacter],
          inkwell: nonRushCharacter.cost,
          deck: 2,
        },
        {
          play: [{ card: jiminyCricketLevelheadedAndWise, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonRushCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(nonRushCharacter)).toBe(false);
    });

    it("does not affect your own Rush characters while Jiminy is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [peterPanShadowFinder],
        inkwell: peterPanShadowFinder.cost,
        play: [{ card: jiminyCricketLevelheadedAndWise, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(peterPanShadowFinder)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(peterPanShadowFinder)).toBe(false);
    });
  });
});
