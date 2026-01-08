// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rabbitIndignantPirate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rabbit - Indignant Pirate", () => {
//   it.skip("BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: rabbitIndignantPirate.cost,
//       hand: [rabbitIndignantPirate],
//     });
//
//     await testEngine.playCard(rabbitIndignantPirate);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
