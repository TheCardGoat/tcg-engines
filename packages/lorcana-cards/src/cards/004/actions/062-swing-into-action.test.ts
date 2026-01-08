// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { swingIntoAction } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Swing Into Action", () => {
//   it.skip("Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_", () => {
//     const testStore = new TestStore({
//       inkwell: swingIntoAction.cost,
//       hand: [swingIntoAction],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", swingIntoAction.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
