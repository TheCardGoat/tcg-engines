// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   stitchAlienBuccaneer,
//   stitchLittleTrickster,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Stitch - Little Trickster", () => {
//   it("NEED A HAND? 1 {I} - This character gets +1 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 6,
//       play: [stitchLittleTrickster],
//       hand: [stitchAlienBuccaneer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(stitchLittleTrickster);
//
//     await testEngine.activateCard(stitchLittleTrickster);
//     expect(cardUnderTest.strength).toBe(stitchLittleTrickster.strength + 1);
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     await testEngine.activateCard(stitchLittleTrickster);
//     expect(cardUnderTest.strength).toBe(stitchLittleTrickster.strength + 2);
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     const { shifter } = await testEngine.shiftCard({
//       shifted: stitchLittleTrickster,
//       shifter: stitchAlienBuccaneer,
//     });
//
//     await testEngine.skipTopOfStack();
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(shifter.strength).toBe(stitchAlienBuccaneer.strength + 2);
//   });
// });
//
