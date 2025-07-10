/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { plasmaBlaster } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  hesATramp,
  johnSilverVengefulPirate,
  weveGotCompany,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("John Silver - Vengeful Pirate", () => {
  describe("DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.", () => {
    it("Doesn't not reduce the cost if there's no damage", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: johnSilverVengefulPirate.cost - 2,
          play: [plasmaBlaster],
          hand: [johnSilverVengefulPirate],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testEngine.getCardModel(johnSilverVengefulPirate);

      await testEngine.playCard(johnSilverVengefulPirate);

      expect(cardUnderTest.cost).toBe(johnSilverVengefulPirate.cost);
      expect(cardUnderTest.zone).toBe("hand");
    });

    it("reduces the cost when opponent's char is damaged", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: johnSilverVengefulPirate.cost,
          play: [plasmaBlaster],
          hand: [johnSilverVengefulPirate],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testEngine.getCardModel(johnSilverVengefulPirate);

      expect(cardUnderTest.cost).toBe(johnSilverVengefulPirate.cost);

      await testEngine.activateCard(plasmaBlaster, {
        targets: [goofyKnightForADay],
      });

      await testEngine.playCard(johnSilverVengefulPirate);
      expect(cardUnderTest.cost).toBe(johnSilverVengefulPirate.cost - 2);

      await testEngine.playCard(johnSilverVengefulPirate);
      expect(cardUnderTest.zone).toBe("play");
    });
  });

  it("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [johnSilverVengefulPirate],
    });

    const cardUnderTest = testEngine.getCardModel(johnSilverVengefulPirate);
    expect(cardUnderTest.hasResist).toBe(true);
  });

  describe("I AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.", () => {
    it("deals 1 damage to chosen character when playing a action not song", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: johnSilverVengefulPirate.cost,
          play: [johnSilverVengefulPirate],
          hand: [weveGotCompany],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      await testEngine.playCard(weveGotCompany);

      await testEngine.resolveOptionalAbility(true);
      await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });

      expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(1);
    });

    it("does NOT deal 1 damage to chosen character when playing a  song", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: johnSilverVengefulPirate.cost,
          play: [johnSilverVengefulPirate],
          hand: [hesATramp],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      await testEngine.playCard(hesATramp, {
        targets: [johnSilverVengefulPirate],
      });
      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
