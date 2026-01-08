// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   liloMakingAWish,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   dalmatianPuppyTailWagger,
//   fantasticalAndMagical,
//   puaProtectivePig,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fantastical And Magical", () => {
//   it("Sing Together 9", async () => {
//     const testEngine = new TestEngine({
//       hand: [fantasticalAndMagical],
//     });
//
//     const cardModel = testEngine.getCardModel(fantasticalAndMagical);
//
//     expect(cardModel.hasSingTogether).toEqual(true);
//   });
//
//   it("For each character that sang this song, draw a card and gain 1 lore.", async () => {
//     const cardsInPlay = [
//       puaProtectivePig, // Cost 3
//       mickeyMouseDetective, // Cost 3
//       dalmatianPuppyTailWagger, // Cost 2
//       liloMakingAWish, // Cost 1
//     ];
//     const testEngine = new TestEngine({
//       hand: [fantasticalAndMagical],
//       play: cardsInPlay,
//       deck: 10,
//     });
//
//     await testEngine.singSongTogether({
//       song: fantasticalAndMagical,
//       singers: cardsInPlay,
//     });
//
//     expect(testEngine.getPlayerLore("player_one")).toEqual(cardsInPlay.length);
//     expect(testEngine.getZonesCardCount().hand).toEqual(cardsInPlay.length);
//   });
// });
//
