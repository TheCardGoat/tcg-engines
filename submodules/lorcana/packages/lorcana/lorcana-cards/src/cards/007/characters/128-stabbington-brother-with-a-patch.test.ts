import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { stabbingtonBrotherWithAPatch } from "./128-stabbington-brother-with-a-patch";

describe("Stabbington Brother - With a Patch", () => {
  describe("CRIME OF OPPORTUNITY - When you play this character, chosen opponent loses 1 lore.", () => {
    it("causes the opponent to lose 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stabbingtonBrotherWithAPatch],
          inkwell: stabbingtonBrotherWithAPatch.cost,
        },
        {
          lore: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(stabbingtonBrotherWithAPatch),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });

    it("does not reduce opponent lore below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stabbingtonBrotherWithAPatch],
          inkwell: stabbingtonBrotherWithAPatch.cost,
        },
        {
          lore: 0,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(stabbingtonBrotherWithAPatch),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });

    it("does not affect the playing player's lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stabbingtonBrotherWithAPatch],
          inkwell: stabbingtonBrotherWithAPatch.cost,
          lore: 5,
        },
        {
          lore: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(stabbingtonBrotherWithAPatch),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(5);
    });
  });
});
