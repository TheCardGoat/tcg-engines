// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { minnieMouseQuickthinkingInventor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Minnie Mouse - Quick-Thinking Inventor", () => {
//   it.skip("**CAKE CATAPULT** When you play this character, chosen character gets -2 {S} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: minnieMouseQuickthinkingInventor.cost,
//       hand: [minnieMouseQuickthinkingInventor],
//     });
//
//     const cardUnderTest = testStore.getCard(minnieMouseQuickthinkingInventor);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
