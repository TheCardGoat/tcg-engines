// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { invitedToTheBallAction } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Invited to the Ball - Action", () => {
//   It.skip("Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.", () => {
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
