// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rememberWhoYouAre } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Remember Who You Are", () => {
//   It.skip("If chosen opponent has more cards in their hand than you, draw cards until you have the same number.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rememberWhoYouAre.cost,
//       Hand: [rememberWhoYouAre],
//     });
//
//     Const cardUnderTest = testStore.getCard(rememberWhoYouAre);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
