import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { aladdinStreetRat } from "./105-aladdin-street-rat";

describe("Aladdin - Street Rat", () => {
  describe("**IMPROVISE** When you play this character, each opponent loses 1 lore.", () => {
    it("Opponent loses 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [aladdinStreetRat],
          inkwell: aladdinStreetRat.cost,
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(aladdinStreetRat)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });

    it("Opponent lore does not go below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [aladdinStreetRat],
          inkwell: aladdinStreetRat.cost,
        },
        {
          lore: 0,
        },
      );

      expect(testEngine.asPlayerOne().playCard(aladdinStreetRat)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });

    it("Does not affect own lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [aladdinStreetRat],
          inkwell: aladdinStreetRat.cost,
          lore: 5,
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(aladdinStreetRat)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(5);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });
  });
});
