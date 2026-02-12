// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Four Dozen Eggs", () => {
//   It.skip("_(A character with cost 4 or more can {E} to sing this", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fourDozenEggs.cost,
//       Play: [fourDozenEggs],
//       Hand: [fourDozenEggs],
//     });
//
//     Await testEngine.playCard(fourDozenEggs);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fourDozenEggs.cost,
//       Play: [fourDozenEggs],
//       Hand: [fourDozenEggs],
//     });
//
//     Await testEngine.playCard(fourDozenEggs);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fourDozenEggs.cost,
//       Play: [fourDozenEggs],
//       Hand: [fourDozenEggs],
//     });
//
//     Await testEngine.playCard(fourDozenEggs);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
