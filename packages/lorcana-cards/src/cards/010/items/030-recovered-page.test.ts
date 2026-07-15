// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KristoffMiningTheRuins,
//   LadyTremaineSinisterSocialite,
//   RecoveredPage,
//   ScroogeMcduckCavernProspector,
//   SimbaKingInTheMaking,
//   TaranPigKeeper,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Recovered Page", () => {
//   Describe("WHAT IS TO COME - When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     It("allows tutoring a character card from top 4 cards to hand", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [
//           KristoffMiningTheRuins,
//           ScroogeMcduckCavernProspector,
//           SimbaKingInTheMaking,
//           TaranPigKeeper,
//         ],
//         Inkwell: recoveredPage.cost,
//         Hand: [recoveredPage],
//       });
//
//       Await testEngine.playCard(recoveredPage, {}, true);
//
//       // Resolve scry: take Kristoff to hand, put rest on bottom
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Hand: [kristoffMiningTheRuins],
//           Bottom: [
//             ScroogeMcduckCavernProspector,
//             SimbaKingInTheMaking,
//             TaranPigKeeper,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(kristoffMiningTheRuins).zone).toBe("hand");
//       Expect(testEngine.getCardModel(scroogeMcduckCavernProspector).zone).toBe(
//         "deck",
//       );
//     });
//
//     It("allows putting all cards on bottom if no character is chosen", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [
//           KristoffMiningTheRuins,
//           ScroogeMcduckCavernProspector,
//           SimbaKingInTheMaking,
//           TaranPigKeeper,
//         ],
//         Inkwell: recoveredPage.cost,
//         Hand: [recoveredPage],
//       });
//
//       Await testEngine.playCard(recoveredPage, {}, true);
//
//       // Resolve scry: don't take any to hand, put all on bottom
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Hand: [],
//           Bottom: [
//             KristoffMiningTheRuins,
//             ScroogeMcduckCavernProspector,
//             SimbaKingInTheMaking,
//             TaranPigKeeper,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(kristoffMiningTheRuins).zone).toBe("deck");
//       Expect(testEngine.getCardModel(scroogeMcduckCavernProspector).zone).toBe(
//         "deck",
//       );
//     });
//   });
//
//   Describe("WHISPERED POWER - 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.", () => {
//     It("allows boosting a character with Boost ability by exerting and banishing the item", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [taranPigKeeper], // Card that will go under Simba
//         Inkwell: 1,
//         Play: [recoveredPage, ladyTremaineSinisterSocialite],
//       });
//
//       Const itemModel = testEngine.getCardModel(recoveredPage);
//       Const boosterCard = testEngine.getCardModel(
//         LadyTremaineSinisterSocialite,
//       );
//
//       // Initial state: no cards under Simba
//       Expect(boosterCard.cardsUnder).toHaveLength(0);
//       Expect(itemModel.zone).toBe("play");
//
//       // Activate the WHISPERED POWER ability (costs 1 ink + banish item)
//       ItemModel.activate("WHISPERED POWER");
//       Await testEngine.resolveTopOfStack({ targets: [boosterCard] }, true);
//
//       // Verify the item is banished
//       Expect(itemModel.zone).toBe("discard");
//
//       // Verify Simba now has a card under him
//       Expect(boosterCard.cardsUnder).toHaveLength(1);
//     });
//   });
// });
//
