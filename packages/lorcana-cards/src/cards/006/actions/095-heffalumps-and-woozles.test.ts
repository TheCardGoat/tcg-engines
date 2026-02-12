// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
//
// Import {
//   CogsworthGrandfatherClock,
//   HiramFlavershamToymaker,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { heffalumpsAndWoozles } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Heffalumps And Woozles", () => {
//   It("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: heffalumpsAndWoozles.cost,
//         Hand: [heffalumpsAndWoozles],
//         Deck: [hiramFlavershamToymaker],
//       },
//       { play: [tipoGrowingSon] },
//     );
//
//     Await testEngine.playCard(heffalumpsAndWoozles);
//
//     Const target = testEngine.getCardModel(tipoGrowingSon);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
//
//   It("NO OPPOSING CHARACTER IN PLAY - Chosen opposing character can't quest during their next turn. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: heffalumpsAndWoozles.cost,
//       Hand: [heffalumpsAndWoozles],
//       Deck: [tipoGrowingSon],
//     });
//
//     Await testEngine.playCard(heffalumpsAndWoozles);
//     Await testEngine.acceptOptionalLayer();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
//
//   It("WARDED OPPOSING CHARACTER IN PLAY - Chosen opposing character can't quest during their next turn. Draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: heffalumpsAndWoozles.cost,
//         Hand: [heffalumpsAndWoozles],
//         Deck: [tipoGrowingSon],
//       },
//       { play: [cogsworthGrandfatherClock] },
//     );
//
//     Await testEngine.playCard(heffalumpsAndWoozles);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
// });
//
