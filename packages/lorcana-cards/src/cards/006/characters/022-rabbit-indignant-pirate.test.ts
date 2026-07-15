// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rabbitIndignantPirate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rabbit - Indignant Pirate", () => {
//   It.skip("BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rabbitIndignantPirate.cost,
//       Hand: [rabbitIndignantPirate],
//     });
//
//     Await testEngine.playCard(rabbitIndignantPirate);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
