// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { poorUnfortunateSouls } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Poor Unfortunate Souls", () => {
//   it("_(A character with cost 2 or more can {E} to sing this song for free.)_Return a character, item or location with cost 2 or less to their player's hand.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: poorUnfortunateSouls.cost,
//         hand: [poorUnfortunateSouls],
//       },
//       {
//         play: [simbaProtectiveCub],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       poorUnfortunateSouls.id,
//     );
//     const target = testStore.getByZoneAndId(
//       "play",
//       simbaProtectiveCub.id,
//       "player_two",
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("hand");
//     // Character should be returned to their owner's hand
//     const returnedCard = testStore.getByZoneAndId(
//       "hand",
//       simbaProtectiveCub.id,
//       "player_two",
//     );
//     expect(returnedCard).toBeDefined();
//   });
// });
//
