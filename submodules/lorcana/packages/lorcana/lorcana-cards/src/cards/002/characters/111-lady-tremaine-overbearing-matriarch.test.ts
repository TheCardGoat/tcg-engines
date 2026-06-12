import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { ladyTremaineOverbearingMatriarch } from "./111-lady-tremaine-overbearing-matriarch";

describe("Lady Tremaine - Overbearing Matriarch", () => {
  describe("NOT FOR YOU - When you play this character, each opponent with more lore than you loses 1 lore.", () => {
    it("makes an opponent with more lore lose 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ladyTremaineOverbearingMatriarch],
          inkwell: ladyTremaineOverbearingMatriarch.cost,
          lore: 1,
        },
        {
          lore: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineOverbearingMatriarch),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
    });

    it("does not make an opponent with equal lore lose lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ladyTremaineOverbearingMatriarch],
          inkwell: ladyTremaineOverbearingMatriarch.cost,
          lore: 3,
        },
        {
          lore: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineOverbearingMatriarch),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not make an opponent with less lore lose lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ladyTremaineOverbearingMatriarch],
          inkwell: ladyTremaineOverbearingMatriarch.cost,
          lore: 5,
        },
        {
          lore: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineOverbearingMatriarch),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
    });
  });
});
