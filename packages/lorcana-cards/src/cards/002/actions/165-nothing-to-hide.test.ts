// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   MickeyMouseArtfulRogue,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { nothingToHide } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Nothing to Hide", () => {
//   It("Each opponent reveals their hand. Draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: nothingToHide.cost,
//         Hand: [nothingToHide],
//         Deck: 2,
//       },
//       {
//         Hand: [
//           MickeyBraveLittleTailor,
//           MickeyMouseArtfulRogue,
//           MickeyMouseTrueFriend,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", nothingToHide.id);
//     Const targets = [
//       TestStore.getByZoneAndId(
//         "hand",
//         MickeyBraveLittleTailor.id,
//         "player_two",
//       ),
//       TestStore.getByZoneAndId("hand", mickeyMouseArtfulRogue.id, "player_two"),
//       TestStore.getByZoneAndId("hand", mickeyMouseTrueFriend.id, "player_two"),
//     ];
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Hand: 1,
//       }),
//     );
//     Targets.forEach((card) => {
//       Expect(card.meta.revealed).toEqual(true);
//     });
//   });
// });
//
