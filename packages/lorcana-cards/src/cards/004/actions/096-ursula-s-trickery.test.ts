// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ursulasTrickery } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula's Trickery", () => {
//   It.skip("Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ursulasTrickery.cost,
//       Hand: [ursulasTrickery],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ursulasTrickery.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
