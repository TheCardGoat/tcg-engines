// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { lostInTheWoods } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lost in the Woods", () => {
//   It.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lostInTheWoods.cost,
//       Play: [lostInTheWoods],
//       Hand: [lostInTheWoods],
//     });
//
//     Await testEngine.playCard(lostInTheWoods);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("All opposing characters get -2 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lostInTheWoods.cost,
//       Play: [lostInTheWoods],
//       Hand: [lostInTheWoods],
//     });
//
//     Await testEngine.playCard(lostInTheWoods);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
