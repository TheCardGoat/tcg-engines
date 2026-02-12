// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { prepareYourBot } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prepare Your Bot", () => {
//   It.skip("Choose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: prepareYourBot.cost,
//       Play: [prepareYourBot],
//       Hand: [prepareYourBot],
//     });
//
//     Await testEngine.playCard(prepareYourBot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("* Ready chosen item.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: prepareYourBot.cost,
//       Play: [prepareYourBot],
//       Hand: [prepareYourBot],
//     });
//
//     Await testEngine.playCard(prepareYourBot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("* Ready chosen Robot character. They can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: prepareYourBot.cost,
//       Play: [prepareYourBot],
//       Hand: [prepareYourBot],
//     });
//
//     Await testEngine.playCard(prepareYourBot);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
