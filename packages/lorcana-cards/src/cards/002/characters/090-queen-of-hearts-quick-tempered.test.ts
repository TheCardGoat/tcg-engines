// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { queenOfHeartsQuickTempered } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Queen of Hearts - Quick-Tempered", () => {
//   It("**ROYALE RAGE** When you play this character, deal 1 damage to chosen damaged opposing character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: queenOfHeartsQuickTempered.cost,
//         Hand: [queenOfHeartsQuickTempered],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseTrueFriend.id,
//       "player_two",
//     );
//     Target.updateCardMeta({ damage: 1 });
//     Expect(target.meta).toEqual(expect.objectContaining({ damage: 1 }));
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       QueenOfHeartsQuickTempered.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta).toEqual(expect.objectContaining({ damage: 2 }));
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
