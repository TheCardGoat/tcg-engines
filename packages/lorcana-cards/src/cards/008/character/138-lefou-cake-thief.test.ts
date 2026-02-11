// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { lefouCakeThief } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("LeFou - Cake Thief", () => {
//   It(" ALL FOR ME {E}, banish one of your items – Chosen opponent loses 1 lore and you gain 1 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [lefouCakeThief, luckyDime],
//         Lore: 5,
//       },
//       {
//         Lore: 5,
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(lefouCakeThief);
//     Const target = testEngine.getCardModel(luckyDime);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Costs: [target],
//     });
//
//     Expect(target.zone).toBe("discard");
//     Expect(cardUnderTest.ready).toBe(false);
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(6);
//     Expect(testEngine.getLoreForPlayer("player_two")).toEqual(4);
//   });
// });
//
