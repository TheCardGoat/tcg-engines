import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { belleUntrainedMystic } from "./037-belle-untrained-mystic";

describe("Belle - Untrained Mystic", () => {
  describe("HERE NOW, DON'T DO THAT - When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", () => {
    it("moves 1 damage from a friendly character to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleUntrainedMystic],
          inkwell: belleUntrainedMystic.cost,
          play: [{ card: simbaProtectiveCub, damage: 2 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(belleUntrainedMystic)).toBeSuccessfulCommand();

      // Resolve the optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleUntrainedMystic, {
          resolveOptional: true,
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      // Only 1 damage should move (up to 1)
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleUntrainedMystic],
          inkwell: belleUntrainedMystic.cost,
          play: [{ card: simbaProtectiveCub, damage: 1 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(belleUntrainedMystic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(belleUntrainedMystic, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(0);
    });

    it("plays successfully even with no valid targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [belleUntrainedMystic],
        inkwell: belleUntrainedMystic.cost,
      });

      expect(testEngine.asPlayerOne().playCard(belleUntrainedMystic)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(belleUntrainedMystic)).toBe("play");
    });
  });
});
