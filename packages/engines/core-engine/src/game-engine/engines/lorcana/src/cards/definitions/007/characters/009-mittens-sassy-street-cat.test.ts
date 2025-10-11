import { describe, expect, it } from "bun:test";
import {
  captainHookForcefulDuelist,
  hadesInfernalSchemer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { fishboneQuill } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { letItGo } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { plutoGuardDog } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { mittensSassyStreetCat } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mittens - Sassy Street Cat", () => {
  it("Bodyguard", async () => {
    const testEngine = new TestEngine({
      play: [mittensSassyStreetCat],
    });

    const cardUnderTest = testEngine.getCardModel(mittensSassyStreetCat);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  describe("NO THANKS NECESSARY", () => {
    it("Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 5,
          play: [
            mittensSassyStreetCat,
            plutoGuardDog,
            captainHookForcefulDuelist,
          ],
          hand: [mrSmeeBumblingMate],
        },
        {
          inkwell: 5,
          play: [],
          hand: [letItGo],
          deck: [hadesInfernalSchemer],
        },
      );

      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);

      await testEngine.putIntoInkwell(mrSmeeBumblingMate);

      expect(testEngine.getZonesCardCount().inkwell).toBe(6);
      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(2);

      // This character should not get +1 {L} because it doesn't have Bodyguard
      expect(testEngine.getCardModel(captainHookForcefulDuelist).lore).toBe(1);

      await testEngine.passTurn();

      // Falls off after turn passed
      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
    });

    it("Checking once during your turn", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 5,
          play: [
            mittensSassyStreetCat,
            plutoGuardDog,
            captainHookForcefulDuelist,
            fishboneQuill,
          ],
          hand: [mrSmeeBumblingMate, hiramFlavershamToymaker],
        },
        {
          inkwell: 5,
          play: [],
          hand: [letItGo],
          deck: [hadesInfernalSchemer],
        },
      );

      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);

      await testEngine.putIntoInkwell(mrSmeeBumblingMate);

      await testEngine.activateCard(fishboneQuill);

      await testEngine.resolveTopOfStack({
        targets: [hiramFlavershamToymaker],
      });

      expect(testEngine.getZonesCardCount().inkwell).toBe(7);

      // should only be 2, not 3 because the second ink should not trigger the effect
      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(2);

      // This character should not get +1 {L} because it doesn't have Bodyguard
      expect(testEngine.getCardModel(captainHookForcefulDuelist).lore).toBe(1);

      await testEngine.passTurn();

      // Falls off after turn passed
      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
    });

    it("Not your turn, doesn't trigger", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 5,
          play: [mittensSassyStreetCat, plutoGuardDog, mrSmeeBumblingMate],
          hand: [],
        },
        {
          inkwell: 5,
          play: [],
          hand: [letItGo],
          deck: [hadesInfernalSchemer],
        },
      );

      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);

      await testEngine.passTurn();

      testEngine.playCard(letItGo);

      await testEngine.resolveTopOfStack({ targets: [mrSmeeBumblingMate] });

      expect(testEngine.getCardModel(plutoGuardDog).lore).toBe(1);
    });
  });
});
