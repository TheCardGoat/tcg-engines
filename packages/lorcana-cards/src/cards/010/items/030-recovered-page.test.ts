// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   kristoffMiningTheRuins,
//   ladyTremaineSinisterSocialite,
//   recoveredPage,
//   scroogeMcduckCavernProspector,
//   simbaKingInTheMaking,
//   taranPigKeeper,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Recovered Page", () => {
//   describe("WHAT IS TO COME - When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     it("allows tutoring a character card from top 4 cards to hand", async () => {
//       const testEngine = new TestEngine({
//         deck: [
//           kristoffMiningTheRuins,
//           scroogeMcduckCavernProspector,
//           simbaKingInTheMaking,
//           taranPigKeeper,
//         ],
//         inkwell: recoveredPage.cost,
//         hand: [recoveredPage],
//       });
//
//       await testEngine.playCard(recoveredPage, {}, true);
//
//       // Resolve scry: take Kristoff to hand, put rest on bottom
//       await testEngine.resolveTopOfStack({
//         scry: {
//           hand: [kristoffMiningTheRuins],
//           bottom: [
//             scroogeMcduckCavernProspector,
//             simbaKingInTheMaking,
//             taranPigKeeper,
//           ],
//         },
//       });
//
//       expect(testEngine.getCardModel(kristoffMiningTheRuins).zone).toBe("hand");
//       expect(testEngine.getCardModel(scroogeMcduckCavernProspector).zone).toBe(
//         "deck",
//       );
//     });
//
//     it("allows putting all cards on bottom if no character is chosen", async () => {
//       const testEngine = new TestEngine({
//         deck: [
//           kristoffMiningTheRuins,
//           scroogeMcduckCavernProspector,
//           simbaKingInTheMaking,
//           taranPigKeeper,
//         ],
//         inkwell: recoveredPage.cost,
//         hand: [recoveredPage],
//       });
//
//       await testEngine.playCard(recoveredPage, {}, true);
//
//       // Resolve scry: don't take any to hand, put all on bottom
//       await testEngine.resolveTopOfStack({
//         scry: {
//           hand: [],
//           bottom: [
//             kristoffMiningTheRuins,
//             scroogeMcduckCavernProspector,
//             simbaKingInTheMaking,
//             taranPigKeeper,
//           ],
//         },
//       });
//
//       expect(testEngine.getCardModel(kristoffMiningTheRuins).zone).toBe("deck");
//       expect(testEngine.getCardModel(scroogeMcduckCavernProspector).zone).toBe(
//         "deck",
//       );
//     });
//   });
//
//   describe("WHISPERED POWER - 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.", () => {
//     it("allows boosting a character with Boost ability by exerting and banishing the item", async () => {
//       const testEngine = new TestEngine({
//         deck: [taranPigKeeper], // Card that will go under Simba
//         inkwell: 1,
//         play: [recoveredPage, ladyTremaineSinisterSocialite],
//       });
//
//       const itemModel = testEngine.getCardModel(recoveredPage);
//       const boosterCard = testEngine.getCardModel(
//         ladyTremaineSinisterSocialite,
//       );
//
//       // Initial state: no cards under Simba
//       expect(boosterCard.cardsUnder).toHaveLength(0);
//       expect(itemModel.zone).toBe("play");
//
//       // Activate the WHISPERED POWER ability (costs 1 ink + banish item)
//       itemModel.activate("WHISPERED POWER");
//       await testEngine.resolveTopOfStack({ targets: [boosterCard] }, true);
//
//       // Verify the item is banished
//       expect(itemModel.zone).toBe("discard");
//
//       // Verify Simba now has a card under him
//       expect(boosterCard.cardsUnder).toHaveLength(1);
//     });
//   });
// });
//
