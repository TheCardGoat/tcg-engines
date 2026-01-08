// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rooLittlestPirate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Roo - Littlest Pirate", () => {
//   it.skip("I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: rooLittlestPirate.cost,
//       hand: [rooLittlestPirate],
//     });
//
//     await testEngine.playCard(rooLittlestPirate);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
