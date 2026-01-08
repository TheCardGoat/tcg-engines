// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { clawhauserFrontDeskOfficer } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Clawhauser - Front Desk Officer", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [clawhauserFrontDeskOfficer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it.skip("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
//     const testEngine = new TestEngine({
//       play: [clawhauserFrontDeskOfficer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
//     expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
