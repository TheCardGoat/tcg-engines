// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { wreckitRalphHamHands } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wreck-it Ralph - Ham Hands", () => {
//   It.skip("I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wreckitRalphHamHands.cost,
//       Play: [wreckitRalphHamHands],
//       Hand: [wreckitRalphHamHands],
//     });
//
//     Await testEngine.playCard(wreckitRalphHamHands);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
