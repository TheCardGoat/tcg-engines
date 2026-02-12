// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { isabelaMadrigalGoldenChild } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Isabela Madrigal - Golden Child", () => {
//   It("**LEAVE IT TO ME** Whenever this character quests, your other characters can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Play: [isabelaMadrigalGoldenChild, liloMakingAWish, stichtNewDog],
//     });
//
//     Const cardUnderTest = testStore.getCard(isabelaMadrigalGoldenChild);
//     Const liloMakingAWishCard = testStore.getCard(liloMakingAWish);
//     Const stichtNewDogCard = testStore.getCard(stichtNewDog);
//
//     Expect(stichtNewDogCard.hasQuestRestriction).toEqual(false);
//     Expect(liloMakingAWishCard.hasQuestRestriction).toEqual(false);
//
//     CardUnderTest.quest();
//
//     Expect(stichtNewDogCard.hasQuestRestriction).toEqual(true);
//     Expect(liloMakingAWishCard.hasQuestRestriction).toEqual(true);
//   });
//
//   It("**LADIES FIRST** During your turn, if no other character has quested this turn, this character gets +3 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [isabelaMadrigalGoldenChild, liloMakingAWish, stichtNewDog],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(isabelaMadrigalGoldenChild);
//     Const liloMakingAWishCard = testEngine.getCardModel(liloMakingAWish);
//     Const stichtNewDogCard = testEngine.getCardModel(stichtNewDog);
//
//     Expect(cardUnderTest.lore).toEqual(4);
//
//     Await testEngine.questCard(isabelaMadrigalGoldenChild);
//
//     Expect(cardUnderTest.lore).toEqual(4);
//     Expect(stichtNewDogCard.hasQuestRestriction).toEqual(true);
//     Expect(liloMakingAWishCard.hasQuestRestriction).toEqual(true);
//   });
//
//   It("**LADIES FIRST** During your turn, if no other character has quested this turn, this character gets +3 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [isabelaMadrigalGoldenChild, liloMakingAWish, stichtNewDog],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(isabelaMadrigalGoldenChild);
//     Const liloMakingAWishCard = testEngine.getCardModel(liloMakingAWish);
//     Const stichtNewDogCard = testEngine.getCardModel(stichtNewDog);
//
//     Expect(cardUnderTest.lore).toEqual(4);
//
//     Await testEngine.questCard(liloMakingAWishCard);
//
//     Expect(cardUnderTest.lore).toEqual(1);
//
//     Expect(stichtNewDogCard.hasQuestRestriction).toEqual(false);
//     Expect(liloMakingAWishCard.hasQuestRestriction).toEqual(false);
//
//     Await testEngine.questCard(cardUnderTest);
//
//     Expect(stichtNewDogCard.hasQuestRestriction).toEqual(true);
//     Expect(liloMakingAWishCard.hasQuestRestriction).toEqual(true);
//   });
// });
//
