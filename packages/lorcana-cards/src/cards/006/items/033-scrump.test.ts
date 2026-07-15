// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { scrump } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scrump", () => {
//   It.skip("I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: scrump.cost,
//       Play: [scrump],
//       Hand: [scrump],
//     });
//
//     Await testEngine.playCard(scrump);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
