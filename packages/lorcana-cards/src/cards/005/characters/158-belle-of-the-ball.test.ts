// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { belleOfTheBall } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Belle - Of the Ball", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: belleOfTheBall.cost,
//       Play: [belleOfTheBall],
//     });
//
//     Const cardUnderTest = testStore.getCard(belleOfTheBall);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**USHERED INTO THE PARTY** When you play this character, your other characters gain **Ward** until the start of your next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: belleOfTheBall.cost,
//       Hand: [belleOfTheBall],
//     });
//
//     Const cardUnderTest = testStore.getCard(belleOfTheBall);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
