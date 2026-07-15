// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { cybugInvasiveEnemy } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cy-bug - Invasive Enemy", () => {
//   It.skip("HIVE MIND This character gets +1 {S} for each other character you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: cybugInvasiveEnemy.cost,
//       Play: [cybugInvasiveEnemy],
//       Hand: [cybugInvasiveEnemy],
//     });
//
//     Await testEngine.playCard(cybugInvasiveEnemy);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
