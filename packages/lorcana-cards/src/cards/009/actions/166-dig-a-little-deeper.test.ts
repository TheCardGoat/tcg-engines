// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { digALittleDeeper } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dig A Little Deeper", () => {
//   It.skip("**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: digALittleDeeper.cost,
//       Play: [digALittleDeeper],
//       Hand: [digALittleDeeper],
//     });
//
//     Await testEngine.playCard(digALittleDeeper);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: digALittleDeeper.cost,
//       Play: [digALittleDeeper],
//       Hand: [digALittleDeeper],
//     });
//
//     Await testEngine.playCard(digALittleDeeper);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
