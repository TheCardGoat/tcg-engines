import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { jujuMamaOdiesCompanion } from "./041-juju-mama-odies-companion";

describe("Juju - Mama Odie's Companion", () => {
  describe("BEES' KNEES - When you play this character, move 1 damage counter from chosen character to chosen opposing character.", () => {
    it("moves 1 damage from a friendly character to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jujuMamaOdiesCompanion],
          inkwell: jujuMamaOdiesCompanion.cost,
          play: [{ card: simbaProtectiveCub, damage: 2 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(jujuMamaOdiesCompanion)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jujuMamaOdiesCompanion, {
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      // Exactly 1 damage should be moved (not "up to", so exactly 1)
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    });

    it("moves exactly 1 damage even if source has more than 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jujuMamaOdiesCompanion],
          inkwell: jujuMamaOdiesCompanion.cost,
          play: [{ card: simbaProtectiveCub, damage: 3 }],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(jujuMamaOdiesCompanion)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jujuMamaOdiesCompanion, {
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      // Only 1 damage should be moved (not all 3)
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    });

    it("does not move damage if source has no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jujuMamaOdiesCompanion],
          inkwell: jujuMamaOdiesCompanion.cost,
          play: [simbaProtectiveCub],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      expect(testEngine.asPlayerOne().playCard(jujuMamaOdiesCompanion)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jujuMamaOdiesCompanion, {
          targets: [simbaProtectiveCub, goofyKnightForADay],
        }),
      ).toBeSuccessfulCommand();

      // No damage to move - source has none
      expect(testEngine.asPlayerOne().getDamage(simbaProtectiveCub)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(0);
    });
  });
});
