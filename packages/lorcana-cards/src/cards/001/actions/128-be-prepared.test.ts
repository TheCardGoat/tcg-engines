// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   chiefTui,
//   heiheiBoatSnack,
//   mickeyMouseArtfulRogue,
//   mickeyMouseTrueFriend,
//   moanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Be Prepared", () => {
//   it("Board wipe", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: bePrepared.cost,
//         hand: [bePrepared],
//         play: [chiefTui, moanaOfMotunui, heiheiBoatSnack],
//       },
//       {
//         play: [mickeyMouseTrueFriend, mickeyMouseArtfulRogue],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", bePrepared.id);
//
//     cardUnderTest.playFromHand();
//
//     expect(testStore.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({ play: 0 }),
//     );
//     expect(testStore.getZonesCardCount("player_two")).toEqual(
//       expect.objectContaining({ play: 0 }),
//     );
//   });
// });
//
