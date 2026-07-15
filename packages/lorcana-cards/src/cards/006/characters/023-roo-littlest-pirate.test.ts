// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rooLittlestPirate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Roo - Littlest Pirate", () => {
//   It.skip("I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rooLittlestPirate.cost,
//       Hand: [rooLittlestPirate],
//     });
//
//     Await testEngine.playCard(rooLittlestPirate);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
