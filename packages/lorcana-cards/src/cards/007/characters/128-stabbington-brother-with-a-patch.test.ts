// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { stabbingtonBrotherWithAPatch } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stabbington Brother - With a Patch", () => {
//   It.skip("CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: stabbingtonBrotherWithAPatch.cost,
//       Hand: [stabbingtonBrotherWithAPatch],
//     });
//
//     Await testEngine.playCard(stabbingtonBrotherWithAPatch);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
