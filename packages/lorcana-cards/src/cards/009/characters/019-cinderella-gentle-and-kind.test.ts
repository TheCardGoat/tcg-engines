// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cinderellaGentleAndKind } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cinderella - Gentle and Kind", () => {
//   It.skip("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [cinderellaGentleAndKind],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(cinderellaGentleAndKind);
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
//
//   It.skip("**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: cinderellaGentleAndKind.cost,
//       Play: [cinderellaGentleAndKind],
//       Hand: [cinderellaGentleAndKind],
//     });
//
//     Await testEngine.playCard(cinderellaGentleAndKind);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
