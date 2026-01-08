// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   liloMakingAWish,
//   mauiDemiGod,
//   stichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { daleMischievousRanger } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dale - Mischievous Ranger", () => {
//   describe("**NUTS ABOUT PRANKS** When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.", () => {
//     it("should put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: daleMischievousRanger.cost,
//         deck: [liloMakingAWish, stichtNewDog, mauiDemiGod],
//         hand: [daleMischievousRanger],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(daleMischievousRanger);
//       const topOfDeck = [
//         testEngine.getCardModel(liloMakingAWish),
//         testEngine.getCardModel(stichtNewDog),
//         testEngine.getCardModel(mauiDemiGod),
//       ];
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [daleMischievousRanger] });
//
//       topOfDeck.forEach((card) => {
//         expect(card.zone).toEqual("discard");
//       });
//       expect(cardUnderTest.strength).toEqual(
//         daleMischievousRanger.strength - 3,
//       );
//     });
//   });
// });
//
