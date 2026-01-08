// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { stabbingtonBrotherWithAPatch } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Stabbington Brother - With a Patch", () => {
//   it.skip("CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: stabbingtonBrotherWithAPatch.cost,
//       hand: [stabbingtonBrotherWithAPatch],
//     });
//
//     await testEngine.playCard(stabbingtonBrotherWithAPatch);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
