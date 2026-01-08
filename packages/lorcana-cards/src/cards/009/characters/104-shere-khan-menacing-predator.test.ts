// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { shereKhanMenacingPredator } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Shere Khan - Menacing Predator", () => {
//   it.skip("**DON'T INSULT MY INTELLIGENCE** Whenever one of your characters challenges another character, gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: shereKhanMenacingPredator.cost,
//       play: [shereKhanMenacingPredator],
//       hand: [shereKhanMenacingPredator],
//     });
//
//     await testEngine.playCard(shereKhanMenacingPredator);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
