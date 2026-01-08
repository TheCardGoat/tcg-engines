// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { minnieMouseDazzlingDancer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { montereyJackGoodheartedRanger } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Minnie Mouse - Dazzling Dancer", () => {
//   it("**DANCE-OFF** Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.", () => {
//     const testEngine = new TestEngine(
//       {
//         play: [minnieMouseDazzlingDancer, mickeyMouseTrueFriend],
//       },
//       {
//         play: [montereyJackGoodheartedRanger],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(minnieMouseDazzlingDancer);
//     const mickeyCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//     const target = testEngine.getCardModel(montereyJackGoodheartedRanger);
//
//     target.exert();
//
//     testEngine.challenge({
//       attacker: cardUnderTest,
//       defender: target,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     testEngine.challenge({
//       attacker: mickeyCard,
//       defender: target,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
// });
//
