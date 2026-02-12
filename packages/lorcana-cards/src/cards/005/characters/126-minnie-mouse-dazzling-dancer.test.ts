// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { minnieMouseDazzlingDancer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { montereyJackGoodheartedRanger } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Dazzling Dancer", () => {
//   It("**DANCE-OFF** Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [minnieMouseDazzlingDancer, mickeyMouseTrueFriend],
//       },
//       {
//         Play: [montereyJackGoodheartedRanger],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(minnieMouseDazzlingDancer);
//     Const mickeyCard = testEngine.getCardModel(mickeyMouseTrueFriend);
//     Const target = testEngine.getCardModel(montereyJackGoodheartedRanger);
//
//     Target.exert();
//
//     TestEngine.challenge({
//       Attacker: cardUnderTest,
//       Defender: target,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
//
//     TestEngine.challenge({
//       Attacker: mickeyCard,
//       Defender: target,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
// });
//
