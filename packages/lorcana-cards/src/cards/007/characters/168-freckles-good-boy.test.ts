// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { frecklesGoodBoy } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Freckles - Good Boy", () => {
//   it.skip("JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: frecklesGoodBoy.cost,
//       hand: [frecklesGoodBoy],
//     });
//
//     await testEngine.playCard(frecklesGoodBoy);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
