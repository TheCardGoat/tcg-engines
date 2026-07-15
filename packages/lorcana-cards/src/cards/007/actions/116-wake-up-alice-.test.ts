// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { wakeUpAlice } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wake Up, Alice!", () => {
//   It.skip("Return chosen damaged character to their player's hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wakeUpAlice.cost,
//       Play: [wakeUpAlice],
//       Hand: [wakeUpAlice],
//     });
//
//     Await testEngine.playCard(wakeUpAlice);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
