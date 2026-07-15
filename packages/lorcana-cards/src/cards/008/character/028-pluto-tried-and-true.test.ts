// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { plutoTriedAndTrue } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Tried and True", () => {
//   It("HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: plutoTriedAndTrue.cost,
//       Play: [plutoTriedAndTrue],
//       Hand: [],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(plutoTriedAndTrue);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//     Expect(cardUnderTest.strength).toBe(4);
//
//     TestEngine.setCardDamage(cardUnderTest, 1);
//     Expect(cardUnderTest.hasSupport).toBe(false);
//     Expect(cardUnderTest.strength).toBe(2);
//   });
// });
//
