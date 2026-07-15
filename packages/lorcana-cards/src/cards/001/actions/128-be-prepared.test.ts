// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefTui,
//   HeiheiBoatSnack,
//   MickeyMouseArtfulRogue,
//   MickeyMouseTrueFriend,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Be Prepared", () => {
//   It("Board wipe", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: bePrepared.cost,
//         Hand: [bePrepared],
//         Play: [chiefTui, moanaOfMotunui, heiheiBoatSnack],
//       },
//       {
//         Play: [mickeyMouseTrueFriend, mickeyMouseArtfulRogue],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", bePrepared.id);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ play: 0 }),
//     );
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ play: 0 }),
//     );
//   });
// });
//
