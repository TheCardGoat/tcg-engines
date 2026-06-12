import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraWakingBeautyEnchanted } from "./205-aurora-waking-beauty-enchanted";
import { holdStill } from "../../002/actions/028-hold-still";
import { simbaProtectiveCub } from "../../001";

describe("Aurora - Waking Beauty (Enchanted)", () => {
  describe("SWEET DREAMS", () => {
    it("should ready Aurora when you heal your character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: auroraWakingBeautyEnchanted, exerted: true }, simbaProtectiveCub],
          hand: [holdStill],
          inkwell: holdStill.cost,
          deck: 3,
        },
        { deck: 2 },
      );

      testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);

      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      // Aurora should be readied
      expect(testEngine.isExerted(auroraWakingBeautyEnchanted)).toBe(false);

      // But she can't quest or challenge this turn
      expect(
        testEngine.hasRestriction(auroraWakingBeautyEnchanted, "cant-quest-or-challenge"),
      ).toBe(true);
      expect(testEngine.asServer().getCard(auroraWakingBeautyEnchanted).hasQuestRestriction).toBe(
        true,
      );
      // Verify she can't quest
      expect(testEngine.asPlayerOne().quest(auroraWakingBeautyEnchanted).success).toBe(false);
    });

    it("should not ready Aurora when no damage is actually removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: auroraWakingBeautyEnchanted, exerted: true }, simbaProtectiveCub],
          hand: [holdStill],
          inkwell: holdStill.cost,
          deck: 3,
        },
        { deck: 2 },
      );

      // simba has no damage, so healing does nothing
      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      // Aurora should NOT be readied since no damage was removed
      expect(testEngine.isExerted(auroraWakingBeautyEnchanted)).toBe(true);
      expect(
        testEngine.hasRestriction(auroraWakingBeautyEnchanted, "cant-quest-or-challenge"),
      ).toBe(false);
    });

    it("should not trigger when opponent removes damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaProtectiveCub],
          hand: [holdStill],
          inkwell: holdStill.cost,
          deck: 3,
        },
        {
          play: [{ card: auroraWakingBeautyEnchanted, exerted: true }],
          deck: 2,
        },
      );

      testEngine.asServer().manualSetDamage(simbaProtectiveCub, 2);

      // Player one heals their own character, but Aurora belongs to player two
      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      // Aurora should NOT be readied - she belongs to the opponent
      expect(testEngine.isExerted(auroraWakingBeautyEnchanted)).toBe(true);
      expect(
        testEngine.hasRestriction(auroraWakingBeautyEnchanted, "cant-quest-or-challenge"),
      ).toBe(false);
    });
  });
});
