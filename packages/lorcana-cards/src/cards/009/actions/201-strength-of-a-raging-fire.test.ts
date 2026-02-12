// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { strengthOfARagingFire } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Strength of a Raging Fire", () => {
//   It.skip("_A character with cost 3 or more can {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: strengthOfARagingFire.cost,
//       Play: [strengthOfARagingFire],
//       Hand: [strengthOfARagingFire],
//     });
//
//     Await testEngine.playCard(strengthOfARagingFire);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Deal damage to chosen character equal to the number of characters you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: strengthOfARagingFire.cost,
//       Play: [strengthOfARagingFire],
//       Hand: [strengthOfARagingFire],
//     });
//
//     Await testEngine.playCard(strengthOfARagingFire);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
