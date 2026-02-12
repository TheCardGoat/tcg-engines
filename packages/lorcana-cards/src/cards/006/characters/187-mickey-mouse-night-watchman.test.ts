// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mickeyMouseNightWatchman } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Night Watchman", () => {
//   It.skip("SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMouseNightWatchman.cost,
//       Play: [mickeyMouseNightWatchman],
//       Hand: [mickeyMouseNightWatchman],
//     });
//
//     Await testEngine.playCard(mickeyMouseNightWatchman);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
