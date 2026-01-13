// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   bagheeraGuardianJaguar,
//   cardSoldiersRoyalTroops,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Card Soldiers - Royal Troops", () => {
//   it("TAKE POINT While a damaged character is in play, this character gets +2 {S}.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [cardSoldiersRoyalTroops],
//       },
//       {
//         play: [bagheeraGuardianJaguar],
//       },
//     );
//
//     expect(testEngine.getCardModel(cardSoldiersRoyalTroops).strength).toBe(
//       cardSoldiersRoyalTroops.strength,
//     );
//
//     await testEngine.setCardDamage(bagheeraGuardianJaguar, 1);
//
//     expect(testEngine.getCardModel(cardSoldiersRoyalTroops).strength).toBe(
//       cardSoldiersRoyalTroops.strength + 2,
//     );
//   });
// });
//
