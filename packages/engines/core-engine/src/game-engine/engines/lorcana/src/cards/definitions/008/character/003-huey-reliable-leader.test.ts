/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  dalmatianPuppyTailWagger,
  hueyReliableLeader,
  perditaOnTheLookout,
  tianaNaturalTalent,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Huey - Reliable Leader", () => {
  it("I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: 3,
      play: [hueyReliableLeader],
      hand: [tianaNaturalTalent], // Cost 4
    });

    const cardUnderTest = testEngine.getCardModel(hueyReliableLeader);

    cardUnderTest.quest();

    await testEngine.playCard(tianaNaturalTalent);

    expect(testEngine.getZonesCardCount().play).toBe(2);
    expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(0);
    // console.log();
  });

  it("Player1 have hueyReliableLeader in play and 3 ink. He will can play 2 cards with cost 2 ink, only after quest of hueyReliableLeader. First card will be cost 1 ink and for second card pay full cost.", async () => {
    const testEngine = new TestEngine({
      inkwell: 3,
      play: [hueyReliableLeader],
      hand: [dalmatianPuppyTailWagger, perditaOnTheLookout],
    });

    const cardUnderTest = testEngine.getCardModel(hueyReliableLeader);

    cardUnderTest.quest();

    await testEngine.playCard(dalmatianPuppyTailWagger);
    expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(2);

    await testEngine.playCard(perditaOnTheLookout);
    expect(testEngine.store.tableStore.getTable().inkAvailable()).toEqual(0);

    expect(testEngine.getZonesCardCount().play).toBe(3);
  });
});
