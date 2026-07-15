// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { megaraPullingTheStrings } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Megara - Pulling the Strings", () => {
//   It.skip("WONDER BOY When you play this character, chosen character gets +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: megaraPullingTheStrings.cost,
//       Hand: [megaraPullingTheStrings],
//     });
//
//     Await testEngine.playCard(megaraPullingTheStrings);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
