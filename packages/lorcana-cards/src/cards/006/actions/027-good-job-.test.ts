// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { goodJob } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Good Job!", () => {
//   It.skip("Chosen character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goodJob.cost,
//       Play: [goodJob],
//       Hand: [goodJob],
//     });
//
//     Await testEngine.playCard(goodJob);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
