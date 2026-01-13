// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { invitedToTheBallAction } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Invited to the Ball - Action", () => {
//   it.skip("Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     const testStore = new TestStore({
//       inkwell: invitedToTheBallAction.cost,
//       hand: [invitedToTheBallAction],
//     });
//
//     const cardUnderTest = testStore.getCard(invitedToTheBallAction);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
