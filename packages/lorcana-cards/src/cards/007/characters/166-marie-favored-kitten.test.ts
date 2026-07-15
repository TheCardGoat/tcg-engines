// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { marieFavoredKitten } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Marie - Favored Kitten", () => {
//   It.skip("I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: marieFavoredKitten.cost,
//       Play: [marieFavoredKitten],
//       Hand: [marieFavoredKitten],
//     });
//
//     Await testEngine.playCard(marieFavoredKitten);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
