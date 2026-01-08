// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { showTheWay } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("Show The Way", () => {
//   it("Your characters get +2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [mickeyBraveLittleTailor],
//       hand: [showTheWay],
//     });
//
//     await testEngine.playCard(showTheWay);
//     await testEngine.resolveTopOfStack({});
//
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).strength).toBe(
//       mickeyBraveLittleTailor.strength + 2,
//     );
//   });
// });
//
