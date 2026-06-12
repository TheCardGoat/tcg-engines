import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { kuzcoTemperamentalEmperor } from "./084-kuzco-temperamental-emperor";
import { teKTheBurningOne } from "./126-te-k-the-burning-one";

describe("Kuzco - Temperamental Emperor", () => {
  describe("NO TOUCHY! When this character is challenged and banished, you may banish the challenging character.", () => {
    it("banishes the challenging character when the controller accepts", () => {
      // Te Ka (8/6) challenges Kuzco (2/4) — Kuzco is banished, Te Ka survives
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 1,
          play: [teKTheBurningOne],
        },
        {
          deck: 1,
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(teKTheBurningOne, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      // NO TOUCHY! is optional — it should surface as a bag effect for player two
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(kuzcoTemperamentalEmperor, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Kuzco is banished (lethal damage from challenge)
      expect(testEngine.asPlayerTwo().getCardZone(kuzcoTemperamentalEmperor)).toBe("discard");
      // Te Ka is banished by the triggered effect
      expect(testEngine.asPlayerOne().getCardZone(teKTheBurningOne)).toBe("discard");

      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ discard: 1, play: 0 }),
      );
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ discard: 1, play: 0 }),
      );
    });

    it("does not banish the challenging character when the controller declines", () => {
      // Te Ka (8/6) challenges Kuzco (2/4) — Kuzco is banished, Te Ka survives
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 1,
          play: [teKTheBurningOne],
        },
        {
          deck: 1,
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(teKTheBurningOne, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(kuzcoTemperamentalEmperor, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Kuzco is banished
      expect(testEngine.asPlayerTwo().getCardZone(kuzcoTemperamentalEmperor)).toBe("discard");
      // Te Ka should remain in play (controller declined to use NO TOUCHY!)
      expect(testEngine.asPlayerOne().getCardZone(teKTheBurningOne)).toBe("play");

      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ play: 1, discard: 0 }),
      );
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ discard: 1, play: 0 }),
      );
    });

    it("does not trigger when Kuzco is not banished in the challenge", () => {
      // Create a weak attacker that can't banish Kuzco (willpower 4)
      // Attacker needs strength < 4 to not banish Kuzco
      // Te Ka has 8 strength, so let's use a custom weak attacker
      const weakAttacker = {
        ...teKTheBurningOne,
        id: "kuzco-test-weak-attacker",
        strength: 2,
        willpower: 10,
        abilities: [],
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 1,
          play: [weakAttacker],
        },
        {
          deck: 1,
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakAttacker, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      // Kuzco has 4 willpower, attacker has 2 strength — not banished
      // NO TOUCHY! should NOT trigger
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(kuzcoTemperamentalEmperor)).toBe("play");
    });
  });
});
