// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { halfHexwellCrown } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Half Hexwell Crown", () => {
//   It.skip("**AN UNEXPECTED FIND**, {E}, 2 {I} — Draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: halfHexwellCrown.cost,
//       Play: [halfHexwellCrown],
//     });
//
//     Const cardUnderTest = testStore.getCard(halfHexwellCrown);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**A PERILOUS POWER** {E}, 2 {I}, Discard a card – Exert chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: halfHexwellCrown.cost,
//       Play: [halfHexwellCrown],
//     });
//
//     Const cardUnderTest = testStore.getCard(halfHexwellCrown);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
