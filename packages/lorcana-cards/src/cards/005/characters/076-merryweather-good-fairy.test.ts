// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MerryweatherGoodFairy,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merryweather - Good Fairy", () => {
//   It("**RAY OF HOPE** When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: merryweatherGoodFairy.cost + 1,
//       Hand: [merryweatherGoodFairy],
//       Play: [monstroWhaleOfAWhale],
//     });
//
//     Const cardUnderTest = testStore.getCard(merryweatherGoodFairy);
//     Const target = testStore.getCard(monstroWhaleOfAWhale);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(monstroWhaleOfAWhale.strength + 2);
//   });
// });
//
