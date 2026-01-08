// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { lookAtThisFamily } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Look At This Family", () => {
//   it.skip("**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     const testStore = new TestStore({
//       inkwell: lookAtThisFamily.cost,
//       hand: [lookAtThisFamily],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", lookAtThisFamily.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
