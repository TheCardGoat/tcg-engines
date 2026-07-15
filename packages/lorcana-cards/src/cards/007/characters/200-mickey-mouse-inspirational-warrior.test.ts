// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   MickeyMouseInspirationalWarrior,
//   TeKaElementalTerror,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Inspirational Warrior", () => {
//   It("STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.", async () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: mickeyMouseInspirationalWarrior.cost,
//         Play: [mickeyMouseInspirationalWarrior],
//         Hand: [teKaElementalTerror],
//       },
//       {
//         Play: [mickeyMouseTrumpeter],
//       },
//     );
//     Const challengeTarget = testStore.getCard(mickeyMouseTrumpeter);
//     ChallengeTarget.updateCardMeta({ exerted: true });
//     Const cardUnderTest = testStore.getCard(mickeyMouseInspirationalWarrior);
//     CardUnderTest.challenge(challengeTarget);
//     Const cardToCheatOut = testStore.getCard(teKaElementalTerror);
//
//     Await testStore.resolveTopOfStack({ targets: [cardToCheatOut] });
//     Expect(cardToCheatOut.zone).toBe("play");
//   });
// });
//
