// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rapunzelCreativeCaptor } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rapunzel - Creative Captor", () => {
//   It.skip("ENSNARL When you play this character, chosen opposing character gets -3 this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rapunzelCreativeCaptor.cost,
//       Hand: [rapunzelCreativeCaptor],
//     });
//
//     Await testEngine.playCard(rapunzelCreativeCaptor);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
