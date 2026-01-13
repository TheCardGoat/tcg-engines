// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { ticktockRelentlessCrocodile } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tick-tock - Relentless Crocodile", () => {
//   it.skip("LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: ticktockRelentlessCrocodile.cost,
//       play: [ticktockRelentlessCrocodile],
//       hand: [ticktockRelentlessCrocodile],
//     });
//
//     await testEngine.playCard(ticktockRelentlessCrocodile);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
