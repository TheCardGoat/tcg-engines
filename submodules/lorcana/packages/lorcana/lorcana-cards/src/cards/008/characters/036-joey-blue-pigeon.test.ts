import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { joeyBluePigeon } from "./036-joey-blue-pigeon";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { montereyJackDefiantProtector } from "./188-monterey-jack-defiant-protector";

describe("Joey - Blue Pigeon", () => {
  describe("I'VE GOT JUST THE THING - Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.", () => {
    it("removes 1 damage from each Bodyguard character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: joeyBluePigeon, isDrying: false },
            { card: simbaProtectiveCub, damage: 2 },
            { card: montereyJackDefiantProtector, damage: 2 },
          ],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(joeyBluePigeon)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(joeyBluePigeon, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Both Bodyguard characters should have 1 damage removed
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: simbaProtectiveCub, value: 1 });
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: montereyJackDefiantProtector,
        value: 1,
      });
      // Joey does not have Bodyguard, so its own damage is unchanged (started at 0)
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: joeyBluePigeon, value: 0 });
    });

    it("does not remove damage when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: joeyBluePigeon, isDrying: false },
            { card: simbaProtectiveCub, damage: 2 },
          ],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(joeyBluePigeon)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(joeyBluePigeon, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should be unchanged
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: simbaProtectiveCub, value: 2 });
    });

    it("does not remove damage from characters without Bodyguard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: joeyBluePigeon, isDrying: false },
            { card: simbaProtectiveCub, damage: 2 },
          ],
          deck: 2,
        },
        { deck: 2 },
      );

      // Joey has no Bodyguard, set its damage and verify it is unaffected
      testEngine.asServer().manualSetDamage(joeyBluePigeon, 2);

      expect(testEngine.asPlayerOne().quest(joeyBluePigeon)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(joeyBluePigeon, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Only Bodyguard character receives healing
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: simbaProtectiveCub, value: 1 });
      // Joey (no Bodyguard) is not healed
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: joeyBluePigeon, value: 2 });
    });
  });
});
