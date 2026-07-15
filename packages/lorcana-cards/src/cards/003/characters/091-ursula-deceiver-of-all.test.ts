// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { ursulaDeceiverOfAll } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Deceiver of All", () => {
//   It("**WHAT A DEAL** Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: friendsOnTheOtherSide.cost,
//       Play: [ursulaDeceiverOfAll],
//       Hand: [friendsOnTheOtherSide],
//       Deck: 6,
//     });
//
//     Const cardUnderTest = testStore.getCard(ursulaDeceiverOfAll);
//     Const target = testStore.getCard(friendsOnTheOtherSide);
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 6,
//       }),
//     );
//
//     CardUnderTest.sing(target);
//     TestStore.resolveOptionalAbility();
//
//     Expect(target.zone).toBe("deck");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 4,
//         Deck: 3,
//       }),
//     );
//   });
// });
//
