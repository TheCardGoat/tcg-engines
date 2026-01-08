// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { stitchCarefreeSurfer } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Stitch - Carefree Surfer", () => {
//   it.skip("**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: stitchCarefreeSurfer.cost,
//       hand: [stitchCarefreeSurfer],
//     });
//
//     await testEngine.playCard(stitchCarefreeSurfer);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
