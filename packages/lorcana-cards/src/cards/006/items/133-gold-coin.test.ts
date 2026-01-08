// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { goldCoin } from "@lorcanito/lorcana-engine/cards/006/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gold Coin", () => {
//   it.skip("GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: goldCoin.cost,
//       play: [goldCoin],
//       hand: [goldCoin],
//     });
//
//     await testEngine.playCard(goldCoin);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
