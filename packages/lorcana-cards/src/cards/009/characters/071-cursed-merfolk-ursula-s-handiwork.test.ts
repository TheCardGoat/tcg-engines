// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { cursedMerfolkUrsulasHandiwork } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cursed Merfolk - Ursula's Handiwork", () => {
//   it.skip("**POOR SOULS** Whenever this character is challenged, each opponent chooses and discards a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: cursedMerfolkUrsulasHandiwork.cost,
//       play: [cursedMerfolkUrsulasHandiwork],
//       hand: [cursedMerfolkUrsulasHandiwork],
//     });
//
//     await testEngine.playCard(cursedMerfolkUrsulasHandiwork);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
