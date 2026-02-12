// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { stitchAlienTroublemaker } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stitch - Alien Troublemaker", () => {
//   It("I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [stitchAlienTroublemaker],
//         Deck: 2,
//       },
//       {
//         Play: [liloMakingAWish],
//       },
//     );
//
//     Const cardBeingChallenged = testEngine.getCardModel(liloMakingAWish);
//     CardBeingChallenged.updateCardMeta({ exerted: true });
//
//     TestEngine
//       .getCardModel(stitchAlienTroublemaker)
//       .challenge(cardBeingChallenged);
//
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(1);
//   });
// });
//
