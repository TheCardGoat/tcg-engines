// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { glean } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Glean", () => {
//   It("Targeting your own card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: glean.cost,
//       Hand: [glean],
//       Play: [pawpsicle],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(glean);
//     Const target = testEngine.getCardModel(pawpsicle);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(testEngine.getLoreForPlayer()).toEqual(2);
//   });
//
//   It("Targeting opponent's card", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: glean.cost,
//         Hand: [glean],
//       },
//       {
//         Play: [pawpsicle],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(glean);
//     Const target = testEngine.getCardModel(pawpsicle);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(testEngine.getLoreForPlayer("player_two")).toEqual(2);
//   });
// });
//
