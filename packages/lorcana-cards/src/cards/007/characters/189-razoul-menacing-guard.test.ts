// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { razoulMenacingGuard } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Razoul - Menacing Guard", () => {
//   it.skip("MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: razoulMenacingGuard.cost,
//       hand: [razoulMenacingGuard],
//     });
//
//     await testEngine.playCard(razoulMenacingGuard);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
