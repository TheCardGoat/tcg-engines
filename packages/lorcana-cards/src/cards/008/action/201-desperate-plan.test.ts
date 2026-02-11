// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseArtfulRogue,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mickeyMouseFriendlyFace } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   DesperatePlan,
//   MickeyMouseGiantMouse,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Desperate Plan", () => {
//   Describe("If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.", () => {
//     It("No cards in hand", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: desperatePlan.cost,
//         Hand: [desperatePlan],
//         Deck: 20,
//       });
//
//       Await testEngine.playCard(desperatePlan);
//       // await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 3,
//           Deck: 17,
//         }),
//       );
//     });
//
//     It("With cards in hand", async () => {
//       Const toDiscard = [
//         MickeyMouseGiantMouse,
//         MickeyMouseDetective,
//         MickeyMouseArtfulRogue,
//       ];
//       Const toKeep = [mickeyMouseTrumpeter, mickeyMouseFriendlyFace];
//       Const testEngine = new TestEngine({
//         Inkwell: desperatePlan.cost,
//         Hand: [desperatePlan, ...toDiscard, ...toKeep],
//         Deck: 20,
//       });
//
//       Await testEngine.playCard(desperatePlan, {
//         Targets: toDiscard,
//       });
//
//       For (const card of toDiscard) {
//         Expect(testEngine.getCardModel(card).zone).toEqual("discard");
//       }
//
//       For (const card of toKeep) {
//         Expect(testEngine.getCardModel(card).zone).toEqual("hand");
//       }
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: toDiscard.length + toKeep.length,
//           Discard: toDiscard.length + 1,
//           Deck: 20 - toDiscard.length,
//         }),
//       );
//     });
//   });
// });
//
