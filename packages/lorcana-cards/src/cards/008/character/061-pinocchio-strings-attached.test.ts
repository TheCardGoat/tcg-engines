// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pinocchioStringsAttached } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pinocchio - Strings Attached", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [pinocchioStringsAttached],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(pinocchioStringsAttached);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("GOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.", async () => {
//     const testEngine = new TestEngine({
//       play: [pinocchioStringsAttached],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(pinocchioStringsAttached);
//
//     cardUnderTest.exert();
//
//     cardUnderTest.readyCharacter();
//     await testEngine.resolveOptionalAbility();
//
//     expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
// });
//
