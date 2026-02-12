// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { tritonDiscerningKing } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Triton - Discerning King", () => {
//   It("**CONSIGN TO THE DEPTHS** {E}, Banish one of your items − Gain 3 lore.", () => {
//     Const testStore = new TestEngine({
//       //inkwell: tritonDiscerningKing.cost,
//       Play: [tritonDiscerningKing, luckyDime],
//     });
//
//     Const cardUnderTest = testStore.getCardModel(tritonDiscerningKing);
//
//     Const target = testStore.getCardModel(luckyDime);
//
//     TestStore.activateCard(cardUnderTest);
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//     Expect(testStore.getLoreForPlayer("player_one")).toEqual(3);
//   });
// });
//
