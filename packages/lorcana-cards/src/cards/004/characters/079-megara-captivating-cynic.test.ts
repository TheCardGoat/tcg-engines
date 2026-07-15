// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { megaraCaptivatingCynic } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Megara - Captivating Cynic", () => {
//   Describe("**SHADY DEAL** When you play this character, chose and discard a card or banish this character.", () => {
//     It("skipping the effect banishes her", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: megaraCaptivatingCynic.cost,
//         Hand: [megaraCaptivatingCynic, liloMakingAWish],
//       });
//
//       Const cardUnderTest = await testEngine.playCard(megaraCaptivatingCynic);
//       Await testEngine.skipTopOfStack();
//       Expect(cardUnderTest.zone).toEqual("discard");
//     });
//
//     It("discarding chosen card of yours", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: megaraCaptivatingCynic.cost,
//         Hand: [megaraCaptivatingCynic, liloMakingAWish],
//       });
//
//       Const cardUnderTest = await testEngine.playCard(megaraCaptivatingCynic);
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [liloMakingAWish] });
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(testEngine.getCardZone(liloMakingAWish)).toEqual("discard");
//     });
//   });
// });
//
