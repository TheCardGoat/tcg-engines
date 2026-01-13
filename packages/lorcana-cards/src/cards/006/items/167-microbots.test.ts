// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { microbots } from "@lorcanito/lorcana-engine/cards/006/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Microbots", () => {
//   it.skip("LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: microbots.cost,
//       play: [microbots],
//       hand: [microbots],
//     });
//
//     await testEngine.playCard(microbots);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("INSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: microbots.cost,
//       play: [microbots],
//       hand: [microbots],
//     });
//
//     await testEngine.playCard(microbots);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
