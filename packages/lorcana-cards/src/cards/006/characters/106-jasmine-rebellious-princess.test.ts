// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jasmineRebelliousPrincess } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Rebellious Princess", () => {
//   It.skip("YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jasmineRebelliousPrincess.cost,
//       Play: [jasmineRebelliousPrincess],
//       Hand: [jasmineRebelliousPrincess],
//     });
//
//     Await testEngine.playCard(jasmineRebelliousPrincess);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
