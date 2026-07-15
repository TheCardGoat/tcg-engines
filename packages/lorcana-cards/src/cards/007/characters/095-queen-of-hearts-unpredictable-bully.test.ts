// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DrCalicoGreeneyedMan,
//   QueenOfHeartsUnpredictableBully,
//   RayaGuidanceSeeker,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Queen Of Hearts - Unpredictable Bully", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Queen of Hearts.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [queenOfHeartsUnpredictableBully],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       QueenOfHeartsUnpredictableBully,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("IF I LOSE MY TEMPER… Whenever another character is played, put a damage counter on them.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         DrCalicoGreeneyedMan.cost +
//         QueenOfHeartsUnpredictableBully.cost +
//         RayaGuidanceSeeker.cost,
//       Hand: [
//         DrCalicoGreeneyedMan,
//         QueenOfHeartsUnpredictableBully,
//         RayaGuidanceSeeker,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       QueenOfHeartsUnpredictableBully,
//     );
//     Await testEngine.playCard(cardUnderTest);
//     Expect(cardUnderTest.damage).toBe(0);
//
//     Await testEngine.playCard(rayaGuidanceSeeker);
//     Expect(cardUnderTest.damage).toBe(0);
//     Expect(testEngine.getCardModel(rayaGuidanceSeeker).damage).toBe(1);
//
//     Await testEngine.playCard(drCalicoGreeneyedMan);
//     Expect(cardUnderTest.damage).toBe(0);
//     Expect(testEngine.getCardModel(rayaGuidanceSeeker).damage).toBe(1);
//     Expect(testEngine.getCardModel(drCalicoGreeneyedMan).damage).toBe(1);
//   });
// });
//
