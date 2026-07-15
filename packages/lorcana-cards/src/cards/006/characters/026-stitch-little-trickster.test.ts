// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   StitchAlienBuccaneer,
//   StitchLittleTrickster,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stitch - Little Trickster", () => {
//   It("NEED A HAND? 1 {I} - This character gets +1 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 6,
//       Play: [stitchLittleTrickster],
//       Hand: [stitchAlienBuccaneer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(stitchLittleTrickster);
//
//     Await testEngine.activateCard(stitchLittleTrickster);
//     Expect(cardUnderTest.strength).toBe(stitchLittleTrickster.strength + 1);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Await testEngine.activateCard(stitchLittleTrickster);
//     Expect(cardUnderTest.strength).toBe(stitchLittleTrickster.strength + 2);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Const { shifter } = await testEngine.shiftCard({
//       Shifted: stitchLittleTrickster,
//       Shifter: stitchAlienBuccaneer,
//     });
//
//     Await testEngine.skipTopOfStack();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(shifter.strength).toBe(stitchAlienBuccaneer.strength + 2);
//   });
// });
//
