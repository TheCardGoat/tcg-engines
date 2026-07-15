// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ticktockRelentlessCrocodile } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tick-tock - Relentless Crocodile", () => {
//   It.skip("LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ticktockRelentlessCrocodile.cost,
//       Play: [ticktockRelentlessCrocodile],
//       Hand: [ticktockRelentlessCrocodile],
//     });
//
//     Await testEngine.playCard(ticktockRelentlessCrocodile);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
