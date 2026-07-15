import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-types";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, fireTheCannons } from "@tcg/lorcana-cards/cards/001";
import { tiggerOneOfAKind } from "@tcg/lorcana-cards/cards/002";
import { getToSafety, sleepyHollowTheBridge } from "@tcg/lorcana-cards/cards/010";

describe("#### 7. ZONES", () => {
  describe("7.1. General", () => {
    it("7.1.5. Only cards in a player's Play zone are in play.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fireTheCannons],
        play: [arielOnHumanLegs],
        discard: [sleepyHollowTheBridge],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("discard");
    });

    it("7.1.6. A card that leaves play and later returns comes back without its old damage.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [getToSafety],
        inkwell: getToSafety.cost,
        play: [{ card: sleepyHollowTheBridge, damage: 2 }],
        deck: [arielOnHumanLegs],
      });

      const playId = testEngine.findCardInstanceId(sleepyHollowTheBridge, "play", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(playId, `discard:${PLAYER_ONE}` as ZoneId).success,
      ).toBe(true);

      const discardId = testEngine.findCardInstanceId(sleepyHollowTheBridge, "discard", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().playCard(getToSafety, {
          targets: [discardId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("play");
      expect(testEngine.asPlayerOne().getCard(sleepyHollowTheBridge).damage).toBe(0);
    });

    it("7.1.6.1. A played action resolves before triggered abilities from that play can resolve.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tiggerOneOfAKind],
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

      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(
        tiggerOneOfAKind.strength + 2,
      );
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
