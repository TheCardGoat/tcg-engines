// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pinocchioStringsAttached } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pinocchio - Strings Attached", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [pinocchioStringsAttached],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(pinocchioStringsAttached);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("GOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [pinocchioStringsAttached],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(pinocchioStringsAttached);
//
//     CardUnderTest.exert();
//
//     CardUnderTest.readyCharacter();
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
// });
//
