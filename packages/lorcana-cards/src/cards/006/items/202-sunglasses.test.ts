// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { sunglasses } from "@lorcanito/lorcana-engine/cards/006/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Sunglasses", () => {
//   it.skip("SPYCRAFT {E} - Draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: sunglasses.cost,
//       play: [sunglasses],
//       hand: [sunglasses],
//     });
//
//     await testEngine.playCard(sunglasses);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
