// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { razoulMenacingGuard } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Razoul - Menacing Guard", () => {
//   It.skip("MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: razoulMenacingGuard.cost,
//       Hand: [razoulMenacingGuard],
//     });
//
//     Await testEngine.playCard(razoulMenacingGuard);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
