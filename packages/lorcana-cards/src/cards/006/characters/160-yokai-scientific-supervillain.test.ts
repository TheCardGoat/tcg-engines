// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { yokaiScientificSupervillain } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yokai - Scientific Supervillain", () => {
//   It.skip("Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [yokaiScientificSupervillain],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(yokaiScientificSupervillain);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("NEUROTRANSMITTER You may play items named Microbots for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: yokaiScientificSupervillain.cost,
//       Play: [yokaiScientificSupervillain],
//       Hand: [yokaiScientificSupervillain],
//     });
//
//     Await testEngine.playCard(yokaiScientificSupervillain);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: yokaiScientificSupervillain.cost,
//       Play: [yokaiScientificSupervillain],
//       Hand: [yokaiScientificSupervillain],
//     });
//
//     Await testEngine.playCard(yokaiScientificSupervillain);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
