// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { onYourFeetNow } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("On Your Feet! Now!", () => {
//   It.skip("Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: onYourFeetNow.cost,
//       Hand: [onYourFeetNow],
//     });
//
//     Const cardUnderTest = testStore.getCard(onYourFeetNow);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
