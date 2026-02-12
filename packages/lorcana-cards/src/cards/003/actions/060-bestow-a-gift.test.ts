// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { bestowAGift } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bestow a Gift", () => {
//   It.skip("Move 1 damage counter from chosen character to chosen opposing character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: bestowAGift.cost,
//       Hand: [bestowAGift],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", bestowAGift.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
