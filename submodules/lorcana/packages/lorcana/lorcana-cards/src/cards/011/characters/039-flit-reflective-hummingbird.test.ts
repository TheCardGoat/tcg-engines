import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { flitReflectiveHummingbird } from "./039-flit-reflective-hummingbird";

describe("Flit - Reflective Hummingbird", () => {
  describe("LOOK OUT! - When you play this character, move up to 1 damage from chosen character to chosen opposing character.", () => {
    it("moves 1 damage from a friendly character to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [flitReflectiveHummingbird],
          inkwell: flitReflectiveHummingbird.cost,
          play: [{ card: simbaProtectiveCub, damage: 2 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(flitReflectiveHummingbird)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(flitReflectiveHummingbird, {
          resolveOptional: true,
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      // Only 1 damage should be moved (up to 1)
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [flitReflectiveHummingbird],
          inkwell: flitReflectiveHummingbird.cost,
          play: [{ card: simbaProtectiveCub, damage: 2 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(flitReflectiveHummingbird)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(flitReflectiveHummingbird, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(0);
    });

    it("can be declined when no character has damage to move (turn 1 softlock repro)", () => {
      // Reporter scenario: Flit played turn 1 with no damage on either side.
      // The optional "move up to 1 damage" effect must still be declinable —
      // engine should not softlock waiting on a target that cannot exist.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [flitReflectiveHummingbird],
          inkwell: flitReflectiveHummingbird.cost,
          play: [simbaProtectiveCub],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(flitReflectiveHummingbird)).toBeSuccessfulCommand();

      // The optional ability should still be offered (text says "up to 1"),
      // but declining must resolve cleanly with no targets selected.
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(flitReflectiveHummingbird, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No damage was created or moved.
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(0);
      // Bag must be drained — softlock would leave a pending effect.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("moves 1 damage even if source has only 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [flitReflectiveHummingbird],
          inkwell: flitReflectiveHummingbird.cost,
          play: [{ card: simbaProtectiveCub, damage: 1 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(flitReflectiveHummingbird)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(flitReflectiveHummingbird, {
          resolveOptional: true,
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    });
  });
});
