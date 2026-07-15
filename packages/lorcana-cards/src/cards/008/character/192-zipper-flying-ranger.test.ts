// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MontereyJackDefiantProtector,
//   ZipperFlyingRanger,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Zipper - Flying Ranger", () => {
//   It("BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: zipperFlyingRanger.cost - 1,
//       Play: [montereyJackDefiantProtector],
//       Hand: [zipperFlyingRanger],
//     });
//
//     Await testEngine.playCard(zipperFlyingRanger);
//
//     Expect(testEngine.getCardModel(zipperFlyingRanger).zone).toBe("play");
//   });
//
//   It("BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: zipperFlyingRanger.cost,
//       Play: [zipperFlyingRanger],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(zipperFlyingRanger).hasEvasive).toBe(true);
//     Await testEngine.passTurn();
//     Expect(testEngine.getCardModel(zipperFlyingRanger).hasEvasive).toBe(false);
//   });
// });
//
