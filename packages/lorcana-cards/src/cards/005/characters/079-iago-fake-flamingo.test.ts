// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { iagoFakeFlamingo } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Iago - Fake Flamingo", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: iagoFakeFlamingo.cost,
//       play: [iagoFakeFlamingo],
//     });
//
//     const cardUnderTest = testStore.getCard(iagoFakeFlamingo);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
