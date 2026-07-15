import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, fireTheCannons } from "@tcg/lorcana-cards/cards/001";
import { getToSafety, sleepyHollowTheBridge } from "@tcg/lorcana-cards/cards/010";

describe("#### 7. ZONES", () => {
  describe("# 7.6. Discard", () => {
    it("7.6.1. / 7.6.2. Resolved actions are held in the discard pile.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [arielOnHumanLegs],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [arielOnHumanLegs],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
      expect(testEngine.getCardDefinitionIdsInZone("discard", PLAYER_ONE)).toContain(
        fireTheCannons.id,
      );
    });

    it("7.6.1. / 7.6.2. Cards in discard remain available to effects that target the discard pile.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [getToSafety],
        inkwell: getToSafety.cost,
        discard: [sleepyHollowTheBridge],
        deck: [arielOnHumanLegs],
      });

      const discardId = testEngine.findCardInstanceId(sleepyHollowTheBridge, "discard", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().playCard(getToSafety, {
          targets: [discardId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("play");
    });

    it.skip("7.6.3. Simultaneous discard ordering is rule-relevant, but it needs a dedicated choice surface instead of assuming target order.", () => {});
  });
});
