/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  amberCoil,
  baymaxsChargingStation,
  belleMechanicExtraordinaire,
  rubyCoil,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Belle - Mechanic Extraordinaire", () => {
  it("Shift 7", async () => {
    const testEngine = new TestEngine({
      play: [belleMechanicExtraordinaire],
    });

    const cardUnderTest = testEngine.getCardModel(belleMechanicExtraordinaire);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("SALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.", async () => {
    const discard = [baymaxsChargingStation, amberCoil, rubyCoil];
    const testEngine = new TestEngine({
      discard: discard,
      hand: [belleMechanicExtraordinaire],
    });

    expect(
      testEngine.getCardModel(belleMechanicExtraordinaire).shiftInkCost,
    ).toBe(7 - discard.length);
  });

  describe("REPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.", () => {
    it("Moving 3", async () => {
      const discard = [baymaxsChargingStation, amberCoil, rubyCoil];

      const testEngine = new TestEngine({
        discard,
        play: [belleMechanicExtraordinaire],
      });

      await testEngine.questCard(belleMechanicExtraordinaire, {
        targets: discard,
      });

      expect(testEngine.getLoreForPlayer()).toBe(
        discard.length + belleMechanicExtraordinaire.lore,
      );

      for (const card of discard) {
        expect(testEngine.getCardModel(card).zone).toBe("deck");
      }
    });

    it("Moving 1", async () => {
      const discard = [baymaxsChargingStation];

      const testEngine = new TestEngine({
        discard,
        play: [belleMechanicExtraordinaire],
      });

      await testEngine.questCard(belleMechanicExtraordinaire, {
        targets: discard,
      });

      expect(testEngine.getLoreForPlayer()).toBe(
        discard.length + belleMechanicExtraordinaire.lore,
      );

      for (const card of discard) {
        expect(testEngine.getCardModel(card).zone).toBe("deck");
      }
    });
  });
});
