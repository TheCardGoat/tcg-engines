// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { montereyJackGoodheartedRanger } from "@lorcanito/lorcana-engine/cards/006";
// import { kakamoraBandOfPirates } from "@lorcanito/lorcana-engine/cards/007";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kakamora - Band of Pirates", () => {
//   it("should not have challenger if you don't have another pirate", async () => {
//     const testStore = new TestStore(
//       {
//         inkwell: kakamoraBandOfPirates.cost,
//         play: [kakamoraBandOfPirates],
//         hand: [],
//       },
//       { play: [montereyJackGoodheartedRanger] },
//     );
//     const bigDummyCardToChallenge = testStore.getCard(
//       montereyJackGoodheartedRanger,
//     );
//     bigDummyCardToChallenge.updateCardMeta({ exerted: true });
//     const cardUndertest = testStore.getCard(kakamoraBandOfPirates);
//     cardUndertest.challenge(bigDummyCardToChallenge);
//     expect(bigDummyCardToChallenge.damage).toBe(kakamoraBandOfPirates.strength);
//   });
//   it("should have challenger if you have another pirate", async () => {
//     const testStore = new TestStore(
//       {
//         inkwell: kakamoraBandOfPirates.cost,
//         play: [kakamoraBandOfPirates, mrSmeeBumblingMate],
//         hand: [],
//       },
//       { play: [montereyJackGoodheartedRanger] },
//     );
//     const bigDummyCardToChallenge = testStore.getCard(
//       montereyJackGoodheartedRanger,
//     );
//     bigDummyCardToChallenge.updateCardMeta({ exerted: true });
//     const cardUndertest = testStore.getCard(kakamoraBandOfPirates);
//     cardUndertest.challenge(bigDummyCardToChallenge);
//     expect(bigDummyCardToChallenge.damage).toBe(
//       kakamoraBandOfPirates.strength + 3,
//     );
//   });
// });
//
