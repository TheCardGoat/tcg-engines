// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mrSmeeSteadfastMate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Smee - Steadfast Mate", () => {
//   It.skip("GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mrSmeeSteadfastMate.cost,
//       Play: [mrSmeeSteadfastMate],
//       Hand: [mrSmeeSteadfastMate],
//     });
//
//     Await testEngine.playCard(mrSmeeSteadfastMate);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
