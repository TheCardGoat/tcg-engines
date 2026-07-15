// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Smash", () => {
//   It.skip("Deal 3 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: smash.cost,
//       Play: [smash],
//       Hand: [smash],
//     });
//
//     Await testEngine.playCard(smash);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
