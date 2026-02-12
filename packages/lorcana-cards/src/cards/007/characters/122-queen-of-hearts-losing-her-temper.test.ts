// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { queenOfHeartsLosingHerTemper } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Queen Of Hearts - Losing Her Temper", () => {
//   It("ROYAL PAIN While this character has damage, she gets +3 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [queenOfHeartsLosingHerTemper],
//     });
//
//     Expect(testEngine.getCardModel(queenOfHeartsLosingHerTemper).strength).toBe(
//       QueenOfHeartsLosingHerTemper.strength,
//     );
//
//     Await testEngine.setCardDamage(queenOfHeartsLosingHerTemper, 1);
//
//     Expect(testEngine.getCardModel(queenOfHeartsLosingHerTemper).strength).toBe(
//       QueenOfHeartsLosingHerTemper.strength + 3,
//     );
//   });
// });
//
