// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   AladdinHeroicOutlaw,
//   HeiheiBoatSnack,
//   MagicBroomBucketBrigade,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("You Have Forgotten Me", () => {
//   It("discard 2 cards", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: youHaveForgottenMe.cost,
//         Hand: [youHaveForgottenMe],
//       },
//       {
//         Hand: [
//           MagicBroomBucketBrigade,
//           AladdinHeroicOutlaw,
//           HeiheiBoatSnack,
//           MickeyMouseTrueFriend,
//         ],
//       },
//     );
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       YouHaveForgottenMe.id,
//     );
//
//     Const cardToDiscard1 = testStore.getByZoneAndId(
//       "hand",
//       HeiheiBoatSnack.id,
//       "player_two",
//     );
//     Const cardToDiscard2 = testStore.getByZoneAndId(
//       "hand",
//       MickeyMouseTrueFriend.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.changePlayer("player_two");
//     TestStore.resolveTopOfStack({
//       Targets: [cardToDiscard1, cardToDiscard2],
//     });
//
//     Expect(cardToDiscard1.zone).toEqual("discard");
//     Expect(cardToDiscard2.zone).toEqual("discard");
//
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ hand: 0, discard: 1 }),
//     );
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 2, deck: 0, discard: 2 }),
//     );
//   });
//
//   It("passed priority to opponent", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: youHaveForgottenMe.cost,
//         Hand: [youHaveForgottenMe],
//       },
//       {
//         Hand: [
//           MagicBroomBucketBrigade,
//           AladdinHeroicOutlaw,
//           HeiheiBoatSnack,
//           MickeyMouseTrueFriend,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       YouHaveForgottenMe.id,
//     );
//
//     CardUnderTest.playFromHand();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//     Expect(testStore.store.stackLayerStore.layers[0]?.responder).toEqual(
//       "player_two",
//     );
//     Expect(testStore.store.priorityPlayer).toEqual("player_two");
//   });
// });
//
