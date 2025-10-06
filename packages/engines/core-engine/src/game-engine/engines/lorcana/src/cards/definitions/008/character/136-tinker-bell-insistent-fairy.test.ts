/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielOnHumanLegs,
  mauiHeroToAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { tinkerBellInsistentFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tinker Bell - Insistent Fairy", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tinkerBellInsistentFairy],
    });

    const cardUnderTest = testEngine.getCardModel(tinkerBellInsistentFairy);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("PAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.", () => {
    it("Valid target", () => {
      const testEngine = new TestEngine({
        lore: 0,
        inkwell: mauiHeroToAll.cost,
        hand: [mauiHeroToAll],
        play: [tinkerBellInsistentFairy],
      });

      const targetCard = testEngine.getCardModel(mauiHeroToAll);

      targetCard.playFromHand();
      testEngine.acceptOptionalAbility();

      expect(targetCard.ready).toEqual(false);

      // Expect the lore to be 2
      expect(testEngine.store.tableStore.getTable().lore).toEqual(2);
      expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(0);
      expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("Invalid target", () => {
      const testEngine = new TestEngine({
        lore: 0,
        inkwell: arielOnHumanLegs.cost,
        hand: [arielOnHumanLegs],
        play: [tinkerBellInsistentFairy],
      });

      const targetCard = testEngine.getCardModel(arielOnHumanLegs);

      targetCard.playFromHand();

      expect(targetCard.ready).toEqual(true);
      expect(testEngine.store.tableStore.getTable().lore).toEqual(0);
    });

    it("Skipping effects", () => {
      const testEngine = new TestEngine({
        lore: 0,
        inkwell: mauiHeroToAll.cost,
        hand: [mauiHeroToAll],
        play: [tinkerBellInsistentFairy],
      });

      const targetCard = testEngine.getCardModel(mauiHeroToAll);

      targetCard.playFromHand();
      testEngine.skipTopOfStack();

      expect(targetCard.ready).toEqual(true);
      expect(testEngine.store.tableStore.getTable().lore).toEqual(0);
    });
  });
});

describe("Regression tests for Tinker Bell - Insistent Fairy", () => {
  it("Double Triggers should not gain double lore", async () => {
    const testEngine = new TestEngine({
      lore: 0,
      inkwell: mauiHeroToAll.cost,
      hand: [mauiHeroToAll],
      play: [tinkerBellInsistentFairy, tinkerBellInsistentFairy],
    });

    const targetCard = testEngine.getCardModel(mauiHeroToAll);

    await targetCard.playFromHand();
    await testEngine.acceptOptionalAbility();

    expect(targetCard.ready).toEqual(false);

    expect(testEngine.store.tableStore.getTable().lore).toEqual(2);

    await testEngine.acceptOptionalAbility();
    expect(testEngine.store.tableStore.getTable().lore).toEqual(2);
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
