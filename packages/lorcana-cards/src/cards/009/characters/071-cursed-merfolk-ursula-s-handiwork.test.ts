// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { cursedMerfolkUrsulasHandiwork } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cursed Merfolk - Ursula's Handiwork", () => {
//   It.skip("**POOR SOULS** Whenever this character is challenged, each opponent chooses and discards a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: cursedMerfolkUrsulasHandiwork.cost,
//       Play: [cursedMerfolkUrsulasHandiwork],
//       Hand: [cursedMerfolkUrsulasHandiwork],
//     });
//
//     Await testEngine.playCard(cursedMerfolkUrsulasHandiwork);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
