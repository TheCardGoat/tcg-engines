// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hideAway } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hide Away", () => {
//   It.skip("Put chosen item or location into its player’s inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hideAway.cost,
//       Hand: [hideAway],
//     });
//
//     Const cardUnderTest = testStore.getCard(hideAway);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
