// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { ursulaDeceiverOfAll } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ursula - Deceiver of All", () => {
//   it("**WHAT A DEAL** Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.", () => {
//     const testStore = new TestStore({
//       inkwell: friendsOnTheOtherSide.cost,
//       play: [ursulaDeceiverOfAll],
//       hand: [friendsOnTheOtherSide],
//       deck: 6,
//     });
//
//     const cardUnderTest = testStore.getCard(ursulaDeceiverOfAll);
//     const target = testStore.getCard(friendsOnTheOtherSide);
//
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1,
//         deck: 6,
//       }),
//     );
//
//     cardUnderTest.sing(target);
//     testStore.resolveOptionalAbility();
//
//     expect(target.zone).toBe("deck");
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 4,
//         deck: 3,
//       }),
//     );
//   });
// });
//
