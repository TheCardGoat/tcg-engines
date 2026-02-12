// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hotPotato } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hot Potato", () => {
//   It.skip("Choose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hotPotato.cost,
//       Play: [hotPotato],
//       Hand: [hotPotato],
//     });
//
//     Await testEngine.playCard(hotPotato);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("· Deal 2 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hotPotato.cost,
//       Play: [hotPotato],
//       Hand: [hotPotato],
//     });
//
//     Await testEngine.playCard(hotPotato);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("· Banish chosen item.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hotPotato.cost,
//       Play: [hotPotato],
//       Hand: [hotPotato],
//     });
//
//     Await testEngine.playCard(hotPotato);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
