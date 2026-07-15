// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { johnSilverSternCaptain } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("John Silver - Stern Captain", () => {
//   It.skip("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [johnSilverSternCaptain],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(johnSilverSternCaptain);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("Resist +2 (Damage dealt to this character is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [johnSilverSternCaptain],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(johnSilverSternCaptain);
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
//
//   It.skip("DON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: johnSilverSternCaptain.cost,
//       Play: [johnSilverSternCaptain],
//       Hand: [johnSilverSternCaptain],
//     });
//
//     Await testEngine.playCard(johnSilverSternCaptain);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
