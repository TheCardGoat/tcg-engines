// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmeeCaptainOfTheJollyRoger } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Smee - Captain of the Jolly Roger", () => {
//   It.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mrSmeeCaptainOfTheJollyRoger],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mrSmeeCaptainOfTheJollyRoger);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("RAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mrSmeeCaptainOfTheJollyRoger.cost,
//       Hand: [mrSmeeCaptainOfTheJollyRoger],
//     });
//
//     Await testEngine.playCard(mrSmeeCaptainOfTheJollyRoger);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
