import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { teKTheBurningOne } from "@tcg/lorcana-cards/cards/001";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { balooOlIronPaws } from "./142-baloo-ol-iron-paws";

describe("Baloo - Ol' Iron Paws", () => {
  describe("FIGHT LIKE A BEAR - Your characters with 7 {S} or more can't be dealt damage.", () => {
    it("Only gives effect while in play", () => {
      // Te Ka has strength 8, so should be protected by Baloo
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: teKTheBurningOne, exerted: true, isDrying: false }],
          hand: [balooOlIronPaws],
          inkwell: balooOlIronPaws.cost,
        },
        {
          play: [{ card: heiheiBoatSnack, isDrying: false }],
        },
      );

      // Before Baloo is in play, Te Ka should take damage normally
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Te Ka with Heihei
      expect(
        testEngine.asPlayerTwo().challenge(heiheiBoatSnack, teKTheBurningOne),
      ).toBeSuccessfulCommand();

      // Te Ka should take damage because Baloo is not in play yet
      expect(testEngine.asPlayerOne().getDamage(teKTheBurningOne)).toBeGreaterThan(0);
    });

    it("Protects characters with 7+ strength from challenge damage as defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: balooOlIronPaws, isDrying: false },
            { card: teKTheBurningOne, exerted: true, isDrying: false },
          ],
        },
        {
          play: [{ card: heiheiBoatSnack, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Te Ka (8 strength) - should be protected by Baloo
      expect(
        testEngine.asPlayerTwo().challenge(heiheiBoatSnack, teKTheBurningOne),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(teKTheBurningOne)).toBe(0);
    });

    it("Does not protect characters with less than 7 strength", () => {
      // Baloo himself has 5 strength, so he is NOT protected by his own ability
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: balooOlIronPaws, exerted: true, isDrying: false }],
        },
        {
          play: [{ card: heiheiBoatSnack, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(heiheiBoatSnack, balooOlIronPaws),
      ).toBeSuccessfulCommand();

      // Baloo has 5 strength (< 7) so should take damage
      expect(testEngine.asPlayerOne().getDamage(balooOlIronPaws)).toBeGreaterThan(0);
    });

    it("Protects characters with 7+ strength as attacker in challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: balooOlIronPaws, isDrying: false },
            { card: teKTheBurningOne, isDrying: false },
          ],
        },
        {
          play: [{ card: heiheiBoatSnack, exerted: true, isDrying: false }],
        },
      );

      // Te Ka challenges Heihei - Te Ka (8 strength) should be protected
      expect(
        testEngine.asPlayerOne().challenge(teKTheBurningOne, heiheiBoatSnack),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(teKTheBurningOne)).toBe(0);
      // Heihei should be banished (Te Ka deals 8 damage, Heihei has low willpower)
      expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("discard");
    });
  });
});
