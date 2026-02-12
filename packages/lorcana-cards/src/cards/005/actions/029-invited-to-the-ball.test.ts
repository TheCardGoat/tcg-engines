// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { invitedToTheBallAction } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Invited to the Ball", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: invitedToTheBallAction.cost,
//       Hand: [invitedToTheBallAction],
//     });
//
//     Const cardUnderTest = testStore.getCard(invitedToTheBallAction);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
