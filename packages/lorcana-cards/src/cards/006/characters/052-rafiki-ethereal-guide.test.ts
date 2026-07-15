// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rafikiEtherealGuide } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rafiki - Ethereal Guide", () => {
//   It("Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rafikiEtherealGuide],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rafikiEtherealGuide);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rafikiEtherealGuide.cost,
//       Play: [rafikiEtherealGuide],
//       Hand: [rafikiEtherealGuide],
//     });
//
//     Await testEngine.playCard(rafikiEtherealGuide);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
