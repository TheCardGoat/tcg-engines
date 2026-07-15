// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieWonderfulTrickster } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Genie - Wonderful Trickster", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [genieWonderfulTrickster],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(genieWonderfulTrickster);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("YOUR REWARD AWAITS Whenever you play a card, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: genieWonderfulTrickster.cost,
//       Play: [genieWonderfulTrickster],
//       Hand: [genieWonderfulTrickster],
//     });
//
//     Await testEngine.playCard(genieWonderfulTrickster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("FORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: genieWonderfulTrickster.cost,
//       Play: [genieWonderfulTrickster],
//       Hand: [genieWonderfulTrickster],
//     });
//
//     Await testEngine.playCard(genieWonderfulTrickster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
