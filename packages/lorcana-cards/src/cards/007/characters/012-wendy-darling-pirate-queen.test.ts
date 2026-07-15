// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { wendyDarlingPirateQueen } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wendy Darling - Pirate Queen", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [wendyDarlingPirateQueen],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(wendyDarlingPirateQueen);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("TELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wendyDarlingPirateQueen.cost,
//       Play: [wendyDarlingPirateQueen],
//       Hand: [wendyDarlingPirateQueen],
//     });
//
//     Await testEngine.playCard(wendyDarlingPirateQueen);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
