// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesLordOfUnderworld,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { queenOfHeartsWonderlandEmpress } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Queen of Hearts - Wonderland Empress", () => {
//   It("**All Ways Here Are My Ways** Whenever this character quests, your other Villain characters get +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         QueenOfHeartsWonderlandEmpress,
//         HadesLordOfUnderworld,
//         RapunzelGiftedWithHealing,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       QueenOfHeartsWonderlandEmpress,
//     );
//     Const villain = testEngine.getCardModel(hadesLordOfUnderworld);
//     Const nonVillain = testEngine.getCardModel(rapunzelGiftedWithHealing);
//
//     CardUnderTest.quest();
//
//     Expect(cardUnderTest.lore).toBe(1); // not effecting herself
//     Expect(villain.lore).toBe(2); // effecting villain
//     Expect(nonVillain.lore).toBe(2); // not effecting non-villain
//
//     Await testEngine.passTurn();
//
//     Expect(villain.lore).toBe(1);
//     Expect(nonVillain.lore).toBe(2);
//   });
// });
//
