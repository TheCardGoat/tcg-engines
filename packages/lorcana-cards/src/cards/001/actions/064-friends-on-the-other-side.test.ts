// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Friends On The Other Side", () => {
//   It("Draw 2 cards", () => {
//     Const testStore = new TestStore({
//       Deck: 2,
//       Hand: [friendsOnTheOtherSide],
//       Inkwell: friendsOnTheOtherSide.cost,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       FriendsOnTheOtherSide.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 2, deck: 0, discard: 1 }),
//     );
//   });
// });
//
