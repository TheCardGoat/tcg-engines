// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { onYourFeetNow } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("On Your Feet! Now!", () => {
//   it.skip("Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: onYourFeetNow.cost,
//       hand: [onYourFeetNow],
//     });
//
//     const cardUnderTest = testStore.getCard(onYourFeetNow);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
