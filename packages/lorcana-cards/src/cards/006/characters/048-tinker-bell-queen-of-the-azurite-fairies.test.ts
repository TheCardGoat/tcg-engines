// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tinkerBellQueenOfTheAzuriteFairies } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tinker Bell - Queen of the Azurite Fairies", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [tinkerBellQueenOfTheAzuriteFairies],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TinkerBellQueenOfTheAzuriteFairies,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [tinkerBellQueenOfTheAzuriteFairies],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TinkerBellQueenOfTheAzuriteFairies,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("SHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tinkerBellQueenOfTheAzuriteFairies.cost,
//       Play: [tinkerBellQueenOfTheAzuriteFairies],
//       Hand: [tinkerBellQueenOfTheAzuriteFairies],
//     });
//
//     Await testEngine.playCard(tinkerBellQueenOfTheAzuriteFairies);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
