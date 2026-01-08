// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { marieFavoredKitten } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Marie - Favored Kitten", () => {
//   it.skip("I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: marieFavoredKitten.cost,
//       play: [marieFavoredKitten],
//       hand: [marieFavoredKitten],
//     });
//
//     await testEngine.playCard(marieFavoredKitten);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
