// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { frecklesGoodBoy } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Freckles - Good Boy", () => {
//   It.skip("JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: frecklesGoodBoy.cost,
//       Hand: [frecklesGoodBoy],
//     });
//
//     Await testEngine.playCard(frecklesGoodBoy);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
