/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { isabelaMadrigalGoldenChild } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Isabela Madrigal - Golden Child", () => {
  it("**LEAVE IT TO ME** Whenever this character quests, your other characters can't quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      play: [isabelaMadrigalGoldenChild, liloMakingAWish, stichtNewDog],
    });

    const cardUnderTest = testStore.getCard(isabelaMadrigalGoldenChild);
    const liloMakingAWishCard = testStore.getCard(liloMakingAWish);
    const stichtNewDogCard = testStore.getCard(stichtNewDog);

    expect(stichtNewDogCard.hasQuestRestriction).toEqual(false);
    expect(liloMakingAWishCard.hasQuestRestriction).toEqual(false);

    cardUnderTest.quest();

    expect(stichtNewDogCard.hasQuestRestriction).toEqual(true);
    expect(liloMakingAWishCard.hasQuestRestriction).toEqual(true);
  });

  it("**LADIES FIRST** During your turn, if no other character has quested this turn, this character gets +3 {L}.", async () => {
    const testEngine = new TestEngine({
      play: [isabelaMadrigalGoldenChild, liloMakingAWish, stichtNewDog],
    });

    const cardUnderTest = testEngine.getCardModel(isabelaMadrigalGoldenChild);
    const liloMakingAWishCard = testEngine.getCardModel(liloMakingAWish);
    const stichtNewDogCard = testEngine.getCardModel(stichtNewDog);

    expect(cardUnderTest.lore).toEqual(4);

    await testEngine.questCard(isabelaMadrigalGoldenChild);

    expect(cardUnderTest.lore).toEqual(4);
    expect(stichtNewDogCard.hasQuestRestriction).toEqual(true);
    expect(liloMakingAWishCard.hasQuestRestriction).toEqual(true);
  });

  it("**LADIES FIRST** During your turn, if no other character has quested this turn, this character gets +3 {L}.", async () => {
    const testEngine = new TestEngine({
      play: [isabelaMadrigalGoldenChild, liloMakingAWish, stichtNewDog],
    });

    const cardUnderTest = testEngine.getCardModel(isabelaMadrigalGoldenChild);
    const liloMakingAWishCard = testEngine.getCardModel(liloMakingAWish);
    const stichtNewDogCard = testEngine.getCardModel(stichtNewDog);

    expect(cardUnderTest.lore).toEqual(4);

    await testEngine.questCard(liloMakingAWishCard);

    expect(cardUnderTest.lore).toEqual(1);

    expect(stichtNewDogCard.hasQuestRestriction).toEqual(false);
    expect(liloMakingAWishCard.hasQuestRestriction).toEqual(false);

    await testEngine.questCard(cardUnderTest);

    expect(stichtNewDogCard.hasQuestRestriction).toEqual(true);
    expect(liloMakingAWishCard.hasQuestRestriction).toEqual(true);
  });
});
