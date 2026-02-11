// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { shereKhanMenacingPredator } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Shere Khan - Menacing Predator", () => {
//   It.skip("**DON'T INSULT MY INTELLIGENCE** Whenever one of your characters challenges another character, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: shereKhanMenacingPredator.cost,
//       Play: [shereKhanMenacingPredator],
//       Hand: [shereKhanMenacingPredator],
//     });
//
//     Await testEngine.playCard(shereKhanMenacingPredator);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
