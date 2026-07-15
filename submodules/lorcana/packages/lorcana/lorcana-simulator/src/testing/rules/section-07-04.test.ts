import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  dinglehopper,
  fireTheCannons,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { sleepyHollowTheBridge } from "@tcg/lorcana-cards/cards/010";

describe("#### 7. ZONES", () => {
  describe("# 7.4. Play", () => {
    it("7.4.1. Characters, items, and locations stay in play, while actions go there only while resolving.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arielOnHumanLegs, dinglehopper, sleepyHollowTheBridge, fireTheCannons],
          inkwell:
            arielOnHumanLegs.cost +
            dinglehopper.cost +
            sleepyHollowTheBridge.cost +
            fireTheCannons.cost,
        },
        {
          play: [mickeyMouseTrueFriend],
        },
      );

      expect(testEngine.asPlayerOne().playCard(arielOnHumanLegs)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(dinglehopper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(sleepyHollowTheBridge)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [mickeyMouseTrueFriend],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
    });

    it("7.4.2. Cards in play have public status information.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: arielOnHumanLegs, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().isExerted(arielOnHumanLegs)).toBe(false);
      expect(testEngine.asPlayerTwo().isExerted(arielOnHumanLegs)).toBe(false);

      expect(testEngine.asPlayerOne().quest(arielOnHumanLegs)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(arielOnHumanLegs)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(arielOnHumanLegs)).toBe(true);
    });

    it.skip("7.4.2.1. Facedown cards in play are a real exception, but this section file does not yet have a compact facedown-play fixture to assert against.", () => {});
  });
});
