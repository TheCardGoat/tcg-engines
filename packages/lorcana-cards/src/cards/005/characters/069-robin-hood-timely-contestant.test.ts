// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { robinHoodTimelyContestant } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin Hood - Timely Contestant", () => {
//   It("**TAG ME IN!** For each 1 damage on opposing characters, you pay 1 {I} less to play this character.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [robinHoodTimelyContestant],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(robinHoodTimelyContestant);
//     Const targetCard = testStore.getCard(goofyKnightForADay);
//
//     [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((damage) => {
//       TargetCard.updateCardMeta({ damage });
//       Expect(cardUnderTest.cost).toBe(robinHoodTimelyContestant.cost - damage);
//     });
//   });
// });
//
