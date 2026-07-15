// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   MauiDemiGod,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { daleMischievousRanger } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dale - Mischievous Ranger", () => {
//   Describe("**NUTS ABOUT PRANKS** When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.", () => {
//     It("should put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: daleMischievousRanger.cost,
//         Deck: [liloMakingAWish, stichtNewDog, mauiDemiGod],
//         Hand: [daleMischievousRanger],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(daleMischievousRanger);
//       Const topOfDeck = [
//         TestEngine.getCardModel(liloMakingAWish),
//         TestEngine.getCardModel(stichtNewDog),
//         TestEngine.getCardModel(mauiDemiGod),
//       ];
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [daleMischievousRanger] });
//
//       TopOfDeck.forEach((card) => {
//         Expect(card.zone).toEqual("discard");
//       });
//       Expect(cardUnderTest.strength).toEqual(
//         DaleMischievousRanger.strength - 3,
//       );
//     });
//   });
// });
//
