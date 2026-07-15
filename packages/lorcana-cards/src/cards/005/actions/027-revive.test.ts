// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { revive } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Revive", () => {
//   It.skip("Play a character card with cost 5 or less from your discard for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: revive.cost,
//       Hand: [revive],
//     });
//
//     Const cardUnderTest = testStore.getCard(revive);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
