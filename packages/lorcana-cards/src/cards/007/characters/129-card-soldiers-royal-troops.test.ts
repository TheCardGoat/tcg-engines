// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BagheeraGuardianJaguar,
//   CardSoldiersRoyalTroops,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Card Soldiers - Royal Troops", () => {
//   It("TAKE POINT While a damaged character is in play, this character gets +2 {S}.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [cardSoldiersRoyalTroops],
//       },
//       {
//         Play: [bagheeraGuardianJaguar],
//       },
//     );
//
//     Expect(testEngine.getCardModel(cardSoldiersRoyalTroops).strength).toBe(
//       CardSoldiersRoyalTroops.strength,
//     );
//
//     Await testEngine.setCardDamage(bagheeraGuardianJaguar, 1);
//
//     Expect(testEngine.getCardModel(cardSoldiersRoyalTroops).strength).toBe(
//       CardSoldiersRoyalTroops.strength + 2,
//     );
//   });
// });
//
