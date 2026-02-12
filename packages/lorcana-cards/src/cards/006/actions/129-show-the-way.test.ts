// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { showTheWay } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("Show The Way", () => {
//   It("Your characters get +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [showTheWay],
//     });
//
//     Await testEngine.playCard(showTheWay);
//     Await testEngine.resolveTopOfStack({});
//
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).strength).toBe(
//       MickeyBraveLittleTailor.strength + 2,
//     );
//   });
// });
//
