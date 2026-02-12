// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { tianaCelebratingPrincess } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tiana- Celebrating Princess", () => {
//   It("Resist 2", () => {
//     Const testStore = new TestStore({
//       Play: [tianaCelebratingPrincess],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TianaCelebratingPrincess.id,
//     );
//
//     Expect(cardUnderTest.hasResist).toEqual(true);
//   });
//
//   Describe("**WHAT YOU GIVE IS WHAT YOU GET** While this character is exerted and you have no cards in your hand, opponents can’t play actions.", () => {
//     It("Exerted, No Cards in Hand", () => {
//       Const testStore = new TestStore(
//         { hand: [grabYourSword], inkwell: grabYourSword.cost },
//         {
//           Play: [tianaCelebratingPrincess],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         TianaCelebratingPrincess.id,
//         "player_two",
//       );
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
//       ActionCard.playFromHand();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Discard: 0,
//           Hand: 1,
//         }),
//       );
//     });
//
//     It("Exerted, With Cards in Hand", () => {
//       Const testStore = new TestStore(
//         { hand: [grabYourSword], inkwell: grabYourSword.cost },
//         {
//           Play: [tianaCelebratingPrincess],
//           Hand: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         TianaCelebratingPrincess.id,
//         "player_two",
//       );
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
//       ActionCard.playFromHand();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Discard: 1,
//           Hand: 0,
//         }),
//       );
//     });
//
//     It("Ready, No Cards in Hand", () => {
//       Const testStore = new TestStore(
//         { hand: [grabYourSword], inkwell: grabYourSword.cost },
//         {
//           Play: [tianaCelebratingPrincess],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         TianaCelebratingPrincess.id,
//         "player_two",
//       );
//       CardUnderTest.updateCardMeta({ exerted: false });
//
//       Const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
//       ActionCard.playFromHand();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Discard: 1,
//           Hand: 0,
//         }),
//       );
//     });
//
//     It("Ready, With Cards in Hand", () => {
//       Const testStore = new TestStore(
//         { hand: [grabYourSword], inkwell: grabYourSword.cost },
//         {
//           Play: [tianaCelebratingPrincess],
//           Hand: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         TianaCelebratingPrincess.id,
//         "player_two",
//       );
//       CardUnderTest.updateCardMeta({ exerted: false });
//
//       Const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
//       ActionCard.playFromHand();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Discard: 1,
//           Hand: 0,
//         }),
//       );
//     });
//   });
// });
//
