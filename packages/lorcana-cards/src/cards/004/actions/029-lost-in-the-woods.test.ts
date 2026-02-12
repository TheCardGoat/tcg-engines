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
// Import { lostInTheWoods } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lost in the Woods", () => {
//   It("_(A character with cost 4 or more can {E} to sing this song for free.)_All opposing characters get -2 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: lostInTheWoods.cost,
//         Hand: [lostInTheWoods],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, simbaProtectiveCub],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", lostInTheWoods.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     // Test that the effect is applied (continuous effect should be active)
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Lost in the Woods goes to discard
//   });
// });
//
