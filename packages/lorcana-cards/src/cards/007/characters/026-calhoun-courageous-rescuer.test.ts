// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { calhounCourageousRescuer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Calhoun - Courageous Rescuer", () => {
//   It.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Calhoun.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [calhounCourageousRescuer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(calhounCourageousRescuer);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("BACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: calhounCourageousRescuer.cost,
//       Play: [calhounCourageousRescuer],
//       Hand: [calhounCourageousRescuer],
//     });
//
//     Await testEngine.playCard(calhounCourageousRescuer);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
