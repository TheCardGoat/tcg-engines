import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub, mickeyMouseTrueFriend } from "../../001";
import { goofyKnightForADay } from "../../002";
import { belleAccomplishedMystic } from "./040-belle-accomplished-mystic";

describe("Belle - Accomplished Mystic", () => {
  describe("ENHANCED HEALING - When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.", () => {
    it("moves damage from a friendly character to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleAccomplishedMystic],
          inkwell: belleAccomplishedMystic.cost,
          play: [{ card: simbaProtectiveCub, damage: 2 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();

      // Resolve the optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMystic, {
          resolveOptional: true,
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(2);
    });

    it("moves up to 3 damage counters when source has 3 or more damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleAccomplishedMystic],
          inkwell: belleAccomplishedMystic.cost,
          play: [{ card: mickeyMouseTrueFriend, damage: 3 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleAccomplishedMystic, {
          resolveOptional: true,
          targets: [mickeyMouseTrueFriend, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleAccomplishedMystic],
          inkwell: belleAccomplishedMystic.cost,
          play: [{ card: simbaProtectiveCub, damage: 2 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(belleAccomplishedMystic, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(0);
    });
  });
});
