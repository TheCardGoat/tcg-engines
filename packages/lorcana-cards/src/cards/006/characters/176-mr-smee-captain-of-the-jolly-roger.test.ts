// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mrSmeeCaptainOfTheJollyRoger } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mr. Smee - Captain of the Jolly Roger", () => {
//   it.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)", async () => {
//     const testEngine = new TestEngine({
//       play: [mrSmeeCaptainOfTheJollyRoger],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mrSmeeCaptainOfTheJollyRoger);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it.skip("RAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mrSmeeCaptainOfTheJollyRoger.cost,
//       hand: [mrSmeeCaptainOfTheJollyRoger],
//     });
//
//     await testEngine.playCard(mrSmeeCaptainOfTheJollyRoger);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
