// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { goldCoin } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gold Coin", () => {
//   It.skip("GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goldCoin.cost,
//       Play: [goldCoin],
//       Hand: [goldCoin],
//     });
//
//     Await testEngine.playCard(goldCoin);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
