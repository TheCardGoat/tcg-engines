// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { lumiereFieryFriend } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { mrsPottsHeadHousekeeper } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mrs. Potts - Head Housekeeper", () => {
//   it("CLEAN UP {E}, Banish one of your items – Draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mrsPottsHeadHousekeeper.cost,
//       play: [mrsPottsHeadHousekeeper, pawpsicle],
//       deck: [lumiereFieryFriend],
//     });
//
//     await testEngine.activateCard(mrsPottsHeadHousekeeper);
//     await testEngine.resolveTopOfStack({
//       targets: [pawpsicle],
//     });
//     expect(testEngine.getCardModel(pawpsicle).zone).toBe("discard");
//     expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("hand");
//   });
// });
//
