// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   DalmatianPuppyTailWagger,
//   FantasticalAndMagical,
//   PuaProtectivePig,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fantastical And Magical", () => {
//   It("Sing Together 9", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [fantasticalAndMagical],
//     });
//
//     Const cardModel = testEngine.getCardModel(fantasticalAndMagical);
//
//     Expect(cardModel.hasSingTogether).toEqual(true);
//   });
//
//   It("For each character that sang this song, draw a card and gain 1 lore.", async () => {
//     Const cardsInPlay = [
//       PuaProtectivePig, // Cost 3
//       MickeyMouseDetective, // Cost 3
//       DalmatianPuppyTailWagger, // Cost 2
//       LiloMakingAWish, // Cost 1
//     ];
//     Const testEngine = new TestEngine({
//       Hand: [fantasticalAndMagical],
//       Play: cardsInPlay,
//       Deck: 10,
//     });
//
//     Await testEngine.singSongTogether({
//       Song: fantasticalAndMagical,
//       Singers: cardsInPlay,
//     });
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(cardsInPlay.length);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(cardsInPlay.length);
//   });
// });
//
