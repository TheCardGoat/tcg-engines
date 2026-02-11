// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { liShangNewlyPromoted } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Li Shang - Newly Promoted", () => {
//   It("I WON'T LET YOU DOWN This character can challenge ready characters.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [liShangNewlyPromoted],
//       },
//       {
//         Play: [tipoGrowingSon],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(liShangNewlyPromoted);
//     Const target = testEngine.getCardModel(tipoGrowingSon);
//
//     Target.updateCardMeta({ exerted: true });
//     CardUnderTest.challenge(target);
//
//     Expect(testEngine.getCardZone(target)).toBe("discard");
//   });
//
//   It("BIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [liShangNewlyPromoted],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(liShangNewlyPromoted);
//     Expect(cardUnderTest.strength).toBe(2);
//     Await testEngine.setCardDamage(cardUnderTest, 1);
//     Expect(cardUnderTest.strength).toBe(4);
//   });
// });
//
