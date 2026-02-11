// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonKarnageAirPirateLeader,
//   MadDogKarnagesFirstMate,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mad Dog - Karnage's First Mate", () => {
//   It("ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madDogKarnagesFirstMate.cost - 1,
//       Play: [donKarnageAirPirateLeader],
//       Hand: [madDogKarnagesFirstMate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(madDogKarnagesFirstMate);
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(cardUnderTest.zone).toEqual("play");
//
//     // await testEngine.resolveOptionalAbility();
//     // await testEngine.resolveTopOfStack({});
//   });
// });
//
