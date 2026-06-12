// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { stitchCarefreeSurfer } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stitch - Carefree Surfer", () => {
//   It.skip("**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: stitchCarefreeSurfer.cost,
//       Hand: [stitchCarefreeSurfer],
//     });
//
//     Await testEngine.playCard(stitchCarefreeSurfer);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
