// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   ChristopherRobinAdventurer,
//   CinderellaStouthearted,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cinderella- Stouthearted", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [cinderellaStouthearted],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CinderellaStouthearted.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBeTruthy();
//   });
//
//   It("Resist", () => {
//     Const testStore = new TestStore({
//       Play: [cinderellaStouthearted],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CinderellaStouthearted.id,
//     );
//
//     Expect(cardUnderTest.hasResist).toBeTruthy();
//   });
//
//   It("**THE SINGING SWORD** Whenever you play a song, this character may challenge ready characters this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: grabYourSword.cost,
//         Hand: [grabYourSword],
//         Play: [cinderellaStouthearted],
//       },
//       { play: [christopherRobinAdventurer] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CinderellaStouthearted.id,
//     );
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       ChristopherRobinAdventurer.id,
//       "player_two",
//     );
//     Const song = testStore.getByZoneAndId("hand", grabYourSword.id);
//
//     Expect(cardUnderTest.canChallenge(defender)).toBeFalsy();
//
//     Song.playFromHand();
//
//     Expect(cardUnderTest.canChallenge(defender)).toBeTruthy();
//   });
// });
//
