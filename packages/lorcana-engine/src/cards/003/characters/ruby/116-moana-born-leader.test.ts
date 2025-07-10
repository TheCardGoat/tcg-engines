/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  balooVonBruinwaldXiii,
  moanaBornLeader,
  mrSnoopsIneptBusinessman,
  puaPotbelliedBuddy,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Moana - Born Leader", () => {
  it("**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Moana._)", () => {
    const testStore = new TestStore({
      play: [moanaBornLeader],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", moanaBornLeader.id);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("**WELCOME TO MY BOAT** Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.", async () => {
    const testStore = new TestEngine({
      inkwell: motunuiIslandParadise.moveCost * 3,
      play: [
        moanaBornLeader,
        motunuiIslandParadise,
        puaPotbelliedBuddy,
        balooVonBruinwaldXiii,
        mrSnoopsIneptBusinessman,
      ],
    });

    await testStore.moveToLocation({
      location: motunuiIslandParadise,
      character: moanaBornLeader,
    });

    // Exerted but not at location
    await testStore.tapCard(mrSnoopsIneptBusinessman);

    const charsAtLocation = [puaPotbelliedBuddy, balooVonBruinwaldXiii];
    for (const card of charsAtLocation) {
      await testStore.tapCard(card);
      await testStore.moveToLocation({
        location: motunuiIslandParadise,
        character: card,
      });
    }

    await testStore.questCard(moanaBornLeader);

    // Only characters at location should be ready
    charsAtLocation.forEach((card) => {
      const cardModel = testStore.getCardModel(card);
      expect(cardModel.ready).toBe(true);
      expect(cardModel.hasQuestRestriction).toBe(true);
    });

    // Moana herself and cards outside location should not be affected
    [moanaBornLeader, mrSnoopsIneptBusinessman].forEach((card) => {
      const cardModel = testStore.getCardModel(card);
      expect(cardModel.ready).toBe(false);
      expect(cardModel.hasQuestRestriction).toBe(false);
    });
  });
});
