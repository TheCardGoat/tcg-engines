// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mrSmeeEfficientCaptain } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Smee - Efficient Captain", () => {
//   It.skip("PIPE UP THE CREW Whenever you play an action that isn’t a song, you may ready chosen Pirate character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mrSmeeEfficientCaptain.cost,
//       Play: [mrSmeeEfficientCaptain],
//       Hand: [mrSmeeEfficientCaptain],
//     });
//
//     Await testEngine.playCard(mrSmeeEfficientCaptain);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
