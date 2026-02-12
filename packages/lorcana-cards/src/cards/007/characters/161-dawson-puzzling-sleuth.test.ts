// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { dawsonPuzzlingSleuth } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dawson - Puzzling Sleuth", () => {
//   It.skip("BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dawsonPuzzlingSleuth.cost,
//       Play: [dawsonPuzzlingSleuth],
//       Hand: [dawsonPuzzlingSleuth],
//     });
//
//     Await testEngine.playCard(dawsonPuzzlingSleuth);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
