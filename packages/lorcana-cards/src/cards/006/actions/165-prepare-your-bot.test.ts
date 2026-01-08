// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { prepareYourBot } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Prepare Your Bot", () => {
//   it.skip("Choose one:", async () => {
//     const testEngine = new TestEngine({
//       inkwell: prepareYourBot.cost,
//       play: [prepareYourBot],
//       hand: [prepareYourBot],
//     });
//
//     await testEngine.playCard(prepareYourBot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("* Ready chosen item.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: prepareYourBot.cost,
//       play: [prepareYourBot],
//       hand: [prepareYourBot],
//     });
//
//     await testEngine.playCard(prepareYourBot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("* Ready chosen Robot character. They can't quest for the rest of this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: prepareYourBot.cost,
//       play: [prepareYourBot],
//       hand: [prepareYourBot],
//     });
//
//     await testEngine.playCard(prepareYourBot);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
