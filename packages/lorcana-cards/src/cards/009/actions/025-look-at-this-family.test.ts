// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { lookAtThisFamily } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Look At This Family", () => {
//   It.skip("**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lookAtThisFamily.cost,
//       Play: [lookAtThisFamily],
//       Hand: [lookAtThisFamily],
//     });
//
//     Await testEngine.playCard(lookAtThisFamily);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lookAtThisFamily.cost,
//       Play: [lookAtThisFamily],
//       Hand: [lookAtThisFamily],
//     });
//
//     Await testEngine.playCard(lookAtThisFamily);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
