// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { julietaMadrigalExcellentCook } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Julieta Madrigal - Excellent Cook", () => {
//   It.skip("**SIGNATURE RECIPE** When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: julietaMadrigalExcellentCook.cost,
//       Hand: [julietaMadrigalExcellentCook],
//     });
//
//     Await testEngine.playCard(julietaMadrigalExcellentCook);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
