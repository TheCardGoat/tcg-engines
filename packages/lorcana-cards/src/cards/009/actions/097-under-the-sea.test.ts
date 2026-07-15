// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { underTheSea } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Under The Sea", () => {
//   It.skip("Sing Together 8 (Any number of your or your teammates’ characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: underTheSea.cost,
//       Play: [underTheSea],
//       Hand: [underTheSea],
//     });
//
//     Await testEngine.playCard(underTheSea);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: underTheSea.cost,
//       Play: [underTheSea],
//       Hand: [underTheSea],
//     });
//
//     Await testEngine.playCard(underTheSea);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
