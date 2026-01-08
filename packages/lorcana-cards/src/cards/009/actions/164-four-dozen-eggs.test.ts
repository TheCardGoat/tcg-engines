// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Four Dozen Eggs", () => {
//   it.skip("_(A character with cost 4 or more can {E} to sing this", async () => {
//     const testEngine = new TestEngine({
//       inkwell: fourDozenEggs.cost,
//       play: [fourDozenEggs],
//       hand: [fourDozenEggs],
//     });
//
//     await testEngine.playCard(fourDozenEggs);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("song for free.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: fourDozenEggs.cost,
//       play: [fourDozenEggs],
//       hand: [fourDozenEggs],
//     });
//
//     await testEngine.playCard(fourDozenEggs);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: fourDozenEggs.cost,
//       play: [fourDozenEggs],
//       hand: [fourDozenEggs],
//     });
//
//     await testEngine.playCard(fourDozenEggs);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
