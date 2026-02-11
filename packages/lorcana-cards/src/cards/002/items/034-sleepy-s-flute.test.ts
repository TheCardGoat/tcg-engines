// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { sleepysFlute } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sleepy's Flute", () => {
//   Describe("**A SILLY SONG** {E} − If you played a song this turn, gain 1 lore.", () => {
//     It("should gain 1 lore if a song was played this turn", () => {
//       Const testStore = new TestStore({
//         Inkwell: hakunaMatata.cost,
//         Hand: [hakunaMatata],
//         Play: [sleepysFlute],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", sleepysFlute.id);
//       Const song = testStore.getByZoneAndId("hand", hakunaMatata.id);
//
//       Song.playFromHand();
//       CardUnderTest.activate();
//
//       Expect(cardUnderTest.ready).toEqual(false);
//       Expect(testStore.store.tableStore.getTable().lore).toEqual(1);
//     });
//
//     It("should not gain 1 lore if a song was NOT played this turn", () => {
//       Const testStore = new TestStore({
//         Play: [sleepysFlute],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", sleepysFlute.id);
//
//       CardUnderTest.activate();
//
//       Expect(testStore.store.tableStore.getTable().lore).toEqual(0);
//     });
//   });
// });
//
