// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BelleHiddenArcher,
//   PinocchioStarAttraction,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Belle - Hidden Archer", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [belleHiddenArcher],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       BelleHiddenArcher.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBeTruthy();
//   });
//
//   Describe("**THORNY ARROWS** Whenever this character is challenged, the challenging character’s player discards all cards in their hand.", () => {
//     It("as defender, discards all cards in hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [pinocchioStarAttraction],
//           Hand: 5,
//         },
//         {
//           Play: [belleHiddenArcher],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BelleHiddenArcher.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         PinocchioStarAttraction.id,
//         "player_one",
//       );
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Attacker.challenge(cardUnderTest);
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Discard: 5 + 1, // 5 from hand, 1 from challenge
//         }),
//       );
//     });
//
//     It("as attacker, discards none", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [belleHiddenArcher],
//           Hand: 5,
//         },
//         {
//           Play: [pinocchioStarAttraction],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BelleHiddenArcher.id,
//         "player_one",
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         PinocchioStarAttraction.id,
//         "player_two",
//       );
//       Defender.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(defender);
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 5,
//           Discard: 0,
//         }),
//       );
//     });
//   });
// });
//
