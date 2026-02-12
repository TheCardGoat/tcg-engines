// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { secondStarToTheRight } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Second Star To The Right", () => {
//   It.skip("Sing Together 10 (Any number of your or your teammates’ characters with total cost 10 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: secondStarToTheRight.cost,
//       Play: [secondStarToTheRight],
//       Hand: [secondStarToTheRight],
//     });
//
//     Await testEngine.playCard(secondStarToTheRight);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Chosen player draws 5 cards.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: secondStarToTheRight.cost,
//       Play: [secondStarToTheRight],
//       Hand: [secondStarToTheRight],
//     });
//
//     Await testEngine.playCard(secondStarToTheRight);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
