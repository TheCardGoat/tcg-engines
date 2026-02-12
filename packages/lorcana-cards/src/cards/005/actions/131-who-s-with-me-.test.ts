// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { whosWithMe } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Who's With Me?", () => {
//   It.skip("Your characters get +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: whosWithMe.cost,
//       Hand: [whosWithMe],
//     });
//
//     Const cardUnderTest = testStore.getCard(whosWithMe);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("Whenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: whosWithMe.cost,
//       Hand: [whosWithMe],
//     });
//
//     Const cardUnderTest = testStore.getCard(whosWithMe);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
