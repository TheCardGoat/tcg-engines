// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { poorUnfortunateSouls } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Poor Unfortunate Souls", () => {
//   It("_(A character with cost 2 or more can {E} to sing this song for free.)_Return a character, item or location with cost 2 or less to their player's hand.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: poorUnfortunateSouls.cost,
//         Hand: [poorUnfortunateSouls],
//       },
//       {
//         Play: [simbaProtectiveCub],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       PoorUnfortunateSouls.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       SimbaProtectiveCub.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("hand");
//     // Character should be returned to their owner's hand
//     Const returnedCard = testStore.getByZoneAndId(
//       "hand",
//       SimbaProtectiveCub.id,
//       "player_two",
//     );
//     Expect(returnedCard).toBeDefined();
//   });
// });
//
