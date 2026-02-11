// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { clawhauserFrontDeskOfficer } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Clawhauser - Front Desk Officer", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [clawhauserFrontDeskOfficer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It.skip("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [clawhauserFrontDeskOfficer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
