// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   SimbaProtectiveCub,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theMobSong } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Mob Song", () => {
//   It("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_Deal 3 damage to up to 3 chosen characters and/or locations.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: theMobSong.cost,
//         Hand: [theMobSong],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, simbaProtectiveCub],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", theMobSong.id);
//     Const target1 = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       SimbaProtectiveCub.id,
//       "player_two",
//     );
//
//     Expect(target1.damage).toBe(0);
//     Expect(target2.damage).toBe(0);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target1, target2] });
//
//     // Test that 3 damage was dealt to both targets
//     Expect(target1.damage).toBe(3);
//     Expect(target2.damage).toBe(3);
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // The Mob Song goes to discard
//   });
// });
//
