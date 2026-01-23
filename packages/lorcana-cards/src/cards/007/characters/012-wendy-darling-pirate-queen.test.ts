// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { wendyDarlingPirateQueen } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Wendy Darling - Pirate Queen", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [wendyDarlingPirateQueen],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(wendyDarlingPirateQueen);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it.skip("TELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: wendyDarlingPirateQueen.cost,
//       play: [wendyDarlingPirateQueen],
//       hand: [wendyDarlingPirateQueen],
//     });
//
//     await testEngine.playCard(wendyDarlingPirateQueen);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
