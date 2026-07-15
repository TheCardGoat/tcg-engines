// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   MerlinRabbit,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Rabbit", () => {
//   Describe("**HOPPITY HIP!** When you play this character and when he leaves play, you may draw a card.", () => {
//     It("When you play", () => {
//       Const testStore = new TestStore({
//         Inkwell: merlinRabbit.cost,
//         Hand: [merlinRabbit],
//         Deck: 1,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", merlinRabbit.id);
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 1,
//           Hand: 1,
//           Play: 0,
//         }),
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 0,
//           Hand: 1,
//           Play: 1,
//         }),
//       );
//     });
//
//     It("When he leaves play", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [merlinRabbit],
//           Deck: 1,
//         },
//         { play: [goofyKnightForADay] },
//       );
//
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         GoofyKnightForADay.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", merlinRabbit.id);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 1,
//           Hand: 0,
//           Play: 1,
//           Discard: 0,
//         }),
//       );
//
//       Attacker.challenge(defender);
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 0,
//           Hand: 1,
//           Play: 0,
//           Discard: 1,
//         }),
//       );
//     });
//   });
// });
//
