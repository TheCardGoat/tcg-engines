// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PullTheLever,
//   WrongLeverAction,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pull The Lever!", () => {
//   Describe("Choose one:", () => {
//     It("- Draw 2 cards.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: pullTheLever.cost,
//         Hand: [pullTheLever],
//         Deck: 10,
//       });
//
//       Await testEngine.playCard(pullTheLever, { mode: "1" });
//
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 2,
//           Deck: 8,
//         }),
//       );
//     });
//
//     It("- Each opponent chooses and discards a card.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: pullTheLever.cost,
//           Hand: [pullTheLever],
//         },
//         {
//           Hand: [wrongLeverAction],
//         },
//       );
//
//       Await testEngine.playCard(pullTheLever, { mode: "2" }, true);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({
//         Targets: [wrongLeverAction],
//       });
//
//       Expect(testEngine.getCardModel(wrongLeverAction).zone).toEqual("discard");
//     });
//   });
// });
//
