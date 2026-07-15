// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { signTheScroll } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sign The Scroll", () => {
//   It.skip("Each opponent may chose and discard a chard. For each opponent who doesn't, you gain 2 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: signTheScroll.cost,
//       Hand: [signTheScroll],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", signTheScroll.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
