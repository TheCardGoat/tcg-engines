// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { duckForCover } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Duck for Cover!", () => {
//   it.skip("Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_", () => {
//     const testStore = new TestStore({
//       inkwell: duckForCover.cost,
//       hand: [duckForCover],
//     });
//
//     const cardUnderTest = testStore.getCard(duckForCover);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
