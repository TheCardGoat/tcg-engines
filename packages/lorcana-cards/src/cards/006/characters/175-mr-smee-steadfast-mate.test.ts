// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mrSmeeSteadfastMate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mr. Smee - Steadfast Mate", () => {
//   it.skip("GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mrSmeeSteadfastMate.cost,
//       play: [mrSmeeSteadfastMate],
//       hand: [mrSmeeSteadfastMate],
//     });
//
//     await testEngine.playCard(mrSmeeSteadfastMate);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
