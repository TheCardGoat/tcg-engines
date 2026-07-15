// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseDetective,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { theBitterwoodUndergroundForest } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Bitterwood - Underground Forest", () => {
//   Describe("GATHER RESOURCES - Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card", () => {
//     It("should trigger and draw a card when moving a character with 5+ strength to the location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theBitterwoodUndergroundForest.moveCost + 1,
//         Play: [theBitterwoodUndergroundForest, simbaKingInTheMaking],
//       });
//
//       Const location = testEngine.getCardModel(theBitterwoodUndergroundForest);
//       Const initialHandSize = testEngine.getZonesCardCount().hand;
//
//       Await testEngine.moveToLocation({
//         Location: theBitterwoodUndergroundForest,
//         Character: simbaKingInTheMaking,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getZonesCardCount().hand).toBe(initialHandSize + 1);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("should not trigger when moving a character with less than 5 strength", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theBitterwoodUndergroundForest.moveCost + 1,
//         Play: [theBitterwoodUndergroundForest, mickeyMouseDetective],
//       });
//
//       Await testEngine.moveToLocation({
//         Location: theBitterwoodUndergroundForest,
//         Character: mickeyMouseDetective,
//       });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("should only trigger once per turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theBitterwoodUndergroundForest.moveCost * 2 + 2,
//         Play: [
//           TheBitterwoodUndergroundForest,
//           SimbaKingInTheMaking,
//           MickeyMouseDetective,
//         ],
//       });
//
//       Const initialHandSize = testEngine.getZonesCardCount().hand;
//
//       // First move - should trigger
//       Await testEngine.moveToLocation({
//         Location: theBitterwoodUndergroundForest,
//         Character: simbaKingInTheMaking,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getZonesCardCount().hand).toBe(initialHandSize + 1);
//
//       // Move character away from location
//       Const simbaModel = testEngine.getCardModel(simbaKingInTheMaking);
//       SimbaModel.leaveLocation();
//
//       // Second move - should not trigger (once per turn)
//       Await testEngine.moveToLocation({
//         Location: theBitterwoodUndergroundForest,
//         Character: simbaKingInTheMaking,
//       });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount().hand).toBe(initialHandSize + 1);
//     });
//
//     It("should be optional - ability is triggered but can be declined", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theBitterwoodUndergroundForest.moveCost + 1,
//         Play: [theBitterwoodUndergroundForest, simbaKingInTheMaking],
//       });
//
//       Await testEngine.moveToLocation({
//         Location: theBitterwoodUndergroundForest,
//         Character: simbaKingInTheMaking,
//       });
//
//       // Verify the optional ability was triggered
//       Expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//       Const topLayer =
//         TestEngine.stackLayers[testEngine.stackLayers.length - 1];
//       Expect(topLayer).toBeDefined();
//       Expect(topLayer?.ability.optional).toBe(true);
//     });
//   });
// });
//
