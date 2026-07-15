// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { montereyJackGoodheartedRanger } from "@lorcanito/lorcana-engine/cards/006";
// Import { kakamoraBandOfPirates } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kakamora - Band of Pirates", () => {
//   It("should not have challenger if you don't have another pirate", async () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: kakamoraBandOfPirates.cost,
//         Play: [kakamoraBandOfPirates],
//         Hand: [],
//       },
//       { play: [montereyJackGoodheartedRanger] },
//     );
//     Const bigDummyCardToChallenge = testStore.getCard(
//       MontereyJackGoodheartedRanger,
//     );
//     BigDummyCardToChallenge.updateCardMeta({ exerted: true });
//     Const cardUndertest = testStore.getCard(kakamoraBandOfPirates);
//     CardUndertest.challenge(bigDummyCardToChallenge);
//     Expect(bigDummyCardToChallenge.damage).toBe(kakamoraBandOfPirates.strength);
//   });
//   It("should have challenger if you have another pirate", async () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: kakamoraBandOfPirates.cost,
//         Play: [kakamoraBandOfPirates, mrSmeeBumblingMate],
//         Hand: [],
//       },
//       { play: [montereyJackGoodheartedRanger] },
//     );
//     Const bigDummyCardToChallenge = testStore.getCard(
//       MontereyJackGoodheartedRanger,
//     );
//     BigDummyCardToChallenge.updateCardMeta({ exerted: true });
//     Const cardUndertest = testStore.getCard(kakamoraBandOfPirates);
//     CardUndertest.challenge(bigDummyCardToChallenge);
//     Expect(bigDummyCardToChallenge.damage).toBe(
//       KakamoraBandOfPirates.strength + 3,
//     );
//   });
// });
//
