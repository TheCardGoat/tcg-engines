// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { strengthOfARagingFire } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Strength of a Raging Fire", () => {
//   it.skip("_A character with cost 3 or more can {E} to sing this song for free.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: strengthOfARagingFire.cost,
//       play: [strengthOfARagingFire],
//       hand: [strengthOfARagingFire],
//     });
//
//     await testEngine.playCard(strengthOfARagingFire);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Deal damage to chosen character equal to the number of characters you have in play.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: strengthOfARagingFire.cost,
//       play: [strengthOfARagingFire],
//       hand: [strengthOfARagingFire],
//     });
//
//     await testEngine.playCard(strengthOfARagingFire);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
