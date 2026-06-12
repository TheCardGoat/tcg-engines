import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { kakamoraMenacingSailor } from "./111-kakamora-menacing-sailor";

describe("Kakamora - Menacing Sailor", () => {
  describe("PLUNDER - When you play this character, each opponent loses 1 lore.", () => {
    it("causes each opponent to lose 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraMenacingSailor],
          inkwell: kakamoraMenacingSailor.cost,
        },
        {
          lore: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(kakamoraMenacingSailor)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });

    it("does not reduce opponent lore below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraMenacingSailor],
          inkwell: kakamoraMenacingSailor.cost,
        },
        {
          lore: 0,
        },
      );

      expect(testEngine.asPlayerOne().playCard(kakamoraMenacingSailor)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });

    it("does not affect the playing player's lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraMenacingSailor],
          inkwell: kakamoraMenacingSailor.cost,
          lore: 5,
        },
        {
          lore: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(kakamoraMenacingSailor)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(5);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });
  });
});
