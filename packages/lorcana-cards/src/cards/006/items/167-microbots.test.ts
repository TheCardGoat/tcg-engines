// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { microbots } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Microbots", () => {
//   It.skip("LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: microbots.cost,
//       Play: [microbots],
//       Hand: [microbots],
//     });
//
//     Await testEngine.playCard(microbots);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("INSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: microbots.cost,
//       Play: [microbots],
//       Hand: [microbots],
//     });
//
//     Await testEngine.playCard(microbots);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
