// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { chiefTui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { julietaMadrigalExcellentCook } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Julieta Madrigal - Excellent Cook", () => {
//   It("**SIGNATURE RECIPE** When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: julietaMadrigalExcellentCook.cost,
//       Deck: 2,
//       Hand: [julietaMadrigalExcellentCook],
//       Play: [chiefTui],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(julietaMadrigalExcellentCook);
//     Const target = testEngine.getCardModel(chiefTui);
//
//     Target.updateCardDamage(2, "add");
//
//     CardUnderTest.playFromHand();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(0);
//     Expect(testEngine.getZonesCardCount().deck).toEqual(1);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
//
//   It("No damage healed", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: julietaMadrigalExcellentCook.cost,
//       Deck: 2,
//       Hand: [julietaMadrigalExcellentCook],
//       Play: [chiefTui],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(julietaMadrigalExcellentCook);
//     Const target = testEngine.getCardModel(chiefTui);
//
//     CardUnderTest.playFromHand();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(0);
//     Expect(testEngine.getZonesCardCount().deck).toEqual(2);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(0);
//   });
// });
//
