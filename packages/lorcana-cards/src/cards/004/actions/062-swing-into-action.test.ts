// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { swingIntoAction } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Swing Into Action", () => {
//   It.skip("Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: swingIntoAction.cost,
//       Hand: [swingIntoAction],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", swingIntoAction.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
