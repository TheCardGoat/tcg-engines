// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   RafikiMysterious,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { cinderellaMelodyWeaver } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cinderella - Melody Weaver", () => {
//   It("**Singer** 9 _(This character counts as cost 9 to sing songs.)_**BEAUTIFUL VOICE** Whenever this character sings a song, your other Princess characters get +1 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Hand: [underTheSea],
//       Play: [
//         CinderellaMelodyWeaver,
//         RapunzelGiftedWithHealing,
//         CinderellaBallroomSensation,
//         RafikiMysterious,
//       ],
//       Deck: [underTheSea, underTheSea, underTheSea],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CinderellaMelodyWeaver.id,
//     );
//
//     // Fetch cards in play and song to sing
//     Const target1 = testStore.getByZoneAndId(
//       "play",
//       RapunzelGiftedWithHealing.id,
//     );
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       CinderellaBallroomSensation.id,
//     );
//     Const target3 = testStore.getByZoneAndId("play", rafikiMysterious.id);
//     Const target4 = testStore.getByZoneAndId("play", cinderellaMelodyWeaver.id);
//     Const song = testStore.getByZoneAndId("hand", underTheSea.id);
//
//     // Check if the card has the singer trait
//     Expect(cardUnderTest.hasSinger).toBe(true);
//
//     // Sing the song
//     CardUnderTest.sing(song);
//
//     // Check if the other Princess characters have +1 lore and non-princess characters are unchanged
//     Expect(target1.lore).toEqual(3);
//     Expect(target2.lore).toEqual(2);
//     Expect(target3.lore).toEqual(1);
//     Expect(target4.lore).toEqual(2);
//
//     // Pass the turn
//     Const response = testStore.passTurn();
//     Expect(response.success).toBeTruthy();
//
//     // Check to see if after the turn has passed, the lore of the other Princess characters has decreased
//     Expect(target1.lore).toEqual(2);
//     Expect(target2.lore).toEqual(1);
//     Expect(target3.lore).toEqual(1);
//     Expect(target4.lore).toEqual(2);
//   });
// });
//
