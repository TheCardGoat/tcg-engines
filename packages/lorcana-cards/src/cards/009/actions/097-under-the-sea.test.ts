// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { underTheSea } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Under The Sea", () => {
//   it.skip("Sing Together 8 (Any number of your or your teammates’ characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: underTheSea.cost,
//       play: [underTheSea],
//       hand: [underTheSea],
//     });
//
//     await testEngine.playCard(underTheSea);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: underTheSea.cost,
//       play: [underTheSea],
//       hand: [underTheSea],
//     });
//
//     await testEngine.playCard(underTheSea);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
