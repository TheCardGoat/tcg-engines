// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { digALittleDeeper } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dig A Little Deeper", () => {
//   it.skip("**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: digALittleDeeper.cost,
//       play: [digALittleDeeper],
//       hand: [digALittleDeeper],
//     });
//
//     await testEngine.playCard(digALittleDeeper);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: digALittleDeeper.cost,
//       play: [digALittleDeeper],
//       hand: [digALittleDeeper],
//     });
//
//     await testEngine.playCard(digALittleDeeper);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
