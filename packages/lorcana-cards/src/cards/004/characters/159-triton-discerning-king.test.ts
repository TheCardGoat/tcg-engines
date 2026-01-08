// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { tritonDiscerningKing } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Triton - Discerning King", () => {
//   it("**CONSIGN TO THE DEPTHS** {E}, Banish one of your items − Gain 3 lore.", () => {
//     const testStore = new TestEngine({
//       //inkwell: tritonDiscerningKing.cost,
//       play: [tritonDiscerningKing, luckyDime],
//     });
//
//     const cardUnderTest = testStore.getCardModel(tritonDiscerningKing);
//
//     const target = testStore.getCardModel(luckyDime);
//
//     testStore.activateCard(cardUnderTest);
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("discard");
//     expect(testStore.getLoreForPlayer("player_one")).toEqual(3);
//   });
// });
//
