// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { lumiereFieryFriend } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { mrsPottsHeadHousekeeper } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mrs. Potts - Head Housekeeper", () => {
//   It("CLEAN UP {E}, Banish one of your items – Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mrsPottsHeadHousekeeper.cost,
//       Play: [mrsPottsHeadHousekeeper, pawpsicle],
//       Deck: [lumiereFieryFriend],
//     });
//
//     Await testEngine.activateCard(mrsPottsHeadHousekeeper);
//     Await testEngine.resolveTopOfStack({
//       Targets: [pawpsicle],
//     });
//     Expect(testEngine.getCardModel(pawpsicle).zone).toBe("discard");
//     Expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("hand");
//   });
// });
//
