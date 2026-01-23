// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { foodFight } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Food Fight!", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: foodFight.cost,
//       hand: [foodFight],
//     });
//
//     const cardUnderTest = testStore.getCard(foodFight);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
