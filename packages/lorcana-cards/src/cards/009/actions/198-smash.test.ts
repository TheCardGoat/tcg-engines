// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { smash } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Smash", () => {
//   it.skip("Deal 3 damage to chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: smash.cost,
//       play: [smash],
//       hand: [smash],
//     });
//
//     await testEngine.playCard(smash);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
