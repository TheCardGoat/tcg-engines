// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseDetective,
//   simbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { theBitterwoodUndergroundForest } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Bitterwood - Underground Forest", () => {
//   describe("GATHER RESOURCES - Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card", () => {
//     it("should trigger and draw a card when moving a character with 5+ strength to the location", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theBitterwoodUndergroundForest.moveCost + 1,
//         play: [theBitterwoodUndergroundForest, simbaKingInTheMaking],
//       });
//
//       const location = testEngine.getCardModel(theBitterwoodUndergroundForest);
//       const initialHandSize = testEngine.getZonesCardCount().hand;
//
//       await testEngine.moveToLocation({
//         location: theBitterwoodUndergroundForest,
//         character: simbaKingInTheMaking,
//       });
//
//       await testEngine.acceptOptionalLayer();
//
//       expect(testEngine.getZonesCardCount().hand).toBe(initialHandSize + 1);
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     it("should not trigger when moving a character with less than 5 strength", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theBitterwoodUndergroundForest.moveCost + 1,
//         play: [theBitterwoodUndergroundForest, mickeyMouseDetective],
//       });
//
//       await testEngine.moveToLocation({
//         location: theBitterwoodUndergroundForest,
//         character: mickeyMouseDetective,
//       });
//
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     it("should only trigger once per turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theBitterwoodUndergroundForest.moveCost * 2 + 2,
//         play: [
//           theBitterwoodUndergroundForest,
//           simbaKingInTheMaking,
//           mickeyMouseDetective,
//         ],
//       });
//
//       const initialHandSize = testEngine.getZonesCardCount().hand;
//
//       // First move - should trigger
//       await testEngine.moveToLocation({
//         location: theBitterwoodUndergroundForest,
//         character: simbaKingInTheMaking,
//       });
//
//       await testEngine.acceptOptionalLayer();
//
//       expect(testEngine.getZonesCardCount().hand).toBe(initialHandSize + 1);
//
//       // Move character away from location
//       const simbaModel = testEngine.getCardModel(simbaKingInTheMaking);
//       simbaModel.leaveLocation();
//
//       // Second move - should not trigger (once per turn)
//       await testEngine.moveToLocation({
//         location: theBitterwoodUndergroundForest,
//         character: simbaKingInTheMaking,
//       });
//
//       expect(testEngine.stackLayers).toHaveLength(0);
//       expect(testEngine.getZonesCardCount().hand).toBe(initialHandSize + 1);
//     });
//
//     it("should be optional - ability is triggered but can be declined", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theBitterwoodUndergroundForest.moveCost + 1,
//         play: [theBitterwoodUndergroundForest, simbaKingInTheMaking],
//       });
//
//       await testEngine.moveToLocation({
//         location: theBitterwoodUndergroundForest,
//         character: simbaKingInTheMaking,
//       });
//
//       // Verify the optional ability was triggered
//       expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//       const topLayer =
//         testEngine.stackLayers[testEngine.stackLayers.length - 1];
//       expect(topLayer).toBeDefined();
//       expect(topLayer?.ability.optional).toBe(true);
//     });
//   });
// });
//
