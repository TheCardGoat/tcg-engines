// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { plutoTriedAndTrue } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pluto - Tried and True", () => {
//   it("HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: plutoTriedAndTrue.cost,
//       play: [plutoTriedAndTrue],
//       hand: [],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(plutoTriedAndTrue);
//     expect(cardUnderTest.hasSupport).toBe(true);
//     expect(cardUnderTest.strength).toBe(4);
//
//     testEngine.setCardDamage(cardUnderTest, 1);
//     expect(cardUnderTest.hasSupport).toBe(false);
//     expect(cardUnderTest.strength).toBe(2);
//   });
// });
//
