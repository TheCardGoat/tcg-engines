import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { donaldDuckPieSlingerEnchanted } from "./214-donald-duck-pie-slinger-enchanted";
import { donaldDuckBoisterousFowl } from "../../001/characters/108-donald-duck-boisterous-fowl";

describe("Donald Duck - Pie Slinger (Enchanted)", () => {
  it("should have Shift 4 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckPieSlingerEnchanted],
      deck: 1,
    });

    expect(testEngine.hasKeyword(donaldDuckPieSlingerEnchanted, "Shift")).toBe(true);
  });

  it("should be present in play zone when placed there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckPieSlingerEnchanted],
      deck: 1,
    });

    const cardId = testEngine.findCardInstanceId(donaldDuckPieSlingerEnchanted, "play", PLAYER_ONE);
    expect(cardId).toBeTruthy();
  });

  describe("HUMBLE PIE - When you play this character, if you used Shift to play him, each opponent loses 2 lore.", () => {
    it("reduces each opponent lore by 2 when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: donaldDuckPieSlingerEnchanted.cost,
          hand: [donaldDuckPieSlingerEnchanted],
          play: [donaldDuckBoisterousFowl],
          deck: 1,
        },
        {
          deck: 1,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 5,
          },
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);

      const shiftTarget = testEngine.findCardInstanceId(
        donaldDuckBoisterousFowl,
        "play",
        PLAYER_ONE,
      );

      expect(
        testEngine.asPlayerOne().playCard(donaldDuckPieSlingerEnchanted, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Resolve triggered ability (HUMBLE PIE)
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(donaldDuckPieSlingerEnchanted),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not trigger when played normally (without Shift)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: donaldDuckPieSlingerEnchanted.cost,
          hand: [donaldDuckPieSlingerEnchanted],
          deck: 1,
        },
        {
          deck: 1,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 5,
          },
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);

      expect(
        testEngine.asPlayerOne().playCard(donaldDuckPieSlingerEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);
    });
  });

  describe("RAGING DUCK - While an opponent has 10 or more lore, this character gets +6 {S}.", () => {
    it("gets +6 strength while an opponent has 10 or more lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckPieSlingerEnchanted],
          deck: 1,
        },
        {
          deck: 1,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 0,
          },
        },
      );

      const baseStrength = donaldDuckPieSlingerEnchanted.strength;

      // Verify base strength before opponent reaches 10 lore
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckPieSlingerEnchanted)).toBe(
        baseStrength,
      );

      // Set opponent lore to 10
      testEngine.asServer().manualSetLore(PLAYER_TWO, 10);

      expect(testEngine.getLore(PLAYER_TWO)).toBe(10);

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckPieSlingerEnchanted)).toBe(
        baseStrength + 6,
      );
    });

    it("does not get +6 strength when opponent has less than 10 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckPieSlingerEnchanted],
          deck: 1,
        },
        {
          deck: 1,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 9,
          },
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckPieSlingerEnchanted)).toBe(
        donaldDuckPieSlingerEnchanted.strength,
      );
    });
  });
});
