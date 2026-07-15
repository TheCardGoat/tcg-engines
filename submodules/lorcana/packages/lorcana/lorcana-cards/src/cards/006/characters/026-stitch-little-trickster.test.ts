import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { stitchLittleTrickster } from "./026-stitch-little-trickster";
import { stitchAlienBuccaneer } from "./072-stitch-alien-buccaneer";

describe("Stitch - Little Trickster", () => {
  describe("NEED A HAND? {I} — This character gets +1 {S} this turn.", () => {
    it("gives this character +1 strength when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: stitchLittleTrickster, isDrying: false }],
        inkwell: 1,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(stitchLittleTrickster)).toBe(
        stitchLittleTrickster.strength,
      );

      expect(
        testEngine.asPlayerOne().activateAbility(stitchLittleTrickster, {
          ability: "NEED A HAND?",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(stitchLittleTrickster)).toBe(
        stitchLittleTrickster.strength + 1,
      );
    });

    it("stacks +1 strength when activated multiple times in a turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: stitchLittleTrickster, isDrying: false }],
        inkwell: 6,
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(stitchLittleTrickster, {
          ability: "NEED A HAND?",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(stitchLittleTrickster)).toBe(
        stitchLittleTrickster.strength + 1,
      );

      expect(
        testEngine.asPlayerOne().activateAbility(stitchLittleTrickster, {
          ability: "NEED A HAND?",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(stitchLittleTrickster)).toBe(
        stitchLittleTrickster.strength + 2,
      );
    });

    it("shifter inherits the strength buff when Stitch is shifted onto", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: stitchLittleTrickster, isDrying: false }],
        hand: [stitchAlienBuccaneer],
        inkwell: 6,
        deck: 1,
      });

      // Activate twice to get +2 strength
      expect(
        testEngine.asPlayerOne().activateAbility(stitchLittleTrickster, {
          ability: "NEED A HAND?",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().activateAbility(stitchLittleTrickster, {
          ability: "NEED A HAND?",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(stitchLittleTrickster)).toBe(
        stitchLittleTrickster.strength + 2,
      );

      // Now shift Alien Buccaneer onto Little Trickster
      const shiftTarget = testEngine.findCardInstanceId(stitchLittleTrickster, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(stitchAlienBuccaneer, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // Resolve the "READY FOR ACTION" triggered ability (optional, decline it)
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(stitchLittleTrickster, { resolveOptional: false });
      }

      // The shifter (Alien Buccaneer) should inherit the +2 strength buff from Little Trickster
      expect(testEngine.asPlayerOne().getCardStrength(stitchAlienBuccaneer)).toBe(
        stitchAlienBuccaneer.strength + 2,
      );
    });
  });
});
