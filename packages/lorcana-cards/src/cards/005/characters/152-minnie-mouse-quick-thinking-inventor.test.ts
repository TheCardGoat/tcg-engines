// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { minnieMouseQuickthinkingInventor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Minnie Mouse - Quick-Thinking Inventor", () => {
//   It.skip("**CAKE CATAPULT** When you play this character, chosen character gets -2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: minnieMouseQuickthinkingInventor.cost,
//       Hand: [minnieMouseQuickthinkingInventor],
//     });
//
//     Const cardUnderTest = testStore.getCard(minnieMouseQuickthinkingInventor);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
