// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { heiheiNotsotrickyChicken } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Heihei - Not-So-Tricky Chicken", () => {
//   It.skip("EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: heiheiNotsotrickyChicken.cost,
//       Hand: [heiheiNotsotrickyChicken],
//     });
//
//     Await testEngine.playCard(heiheiNotsotrickyChicken);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("OUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: heiheiNotsotrickyChicken.cost,
//       Play: [heiheiNotsotrickyChicken],
//       Hand: [heiheiNotsotrickyChicken],
//     });
//
//     Await testEngine.playCard(heiheiNotsotrickyChicken);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
