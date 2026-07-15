// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { secondStarToTheRight } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Second Star To The Right", () => {
//   It("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: secondStarToTheRight.cost,
//       Hand: [secondStarToTheRight],
//     });
//
//     Expect(testEngine.getCardModel(secondStarToTheRight).hasSingTogether).toBe(
//       True,
//     );
//   });
//
//   Describe("Chosen player draws 5 cards.", () => {
//     It("Opponent draws 5", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 10,
//           Inkwell: secondStarToTheRight.cost,
//           Hand: [secondStarToTheRight],
//         },
//         {
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.playCard(secondStarToTheRight, {
//         TargetPlayer: "player_two",
//       });
//
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 10,
//         }),
//       );
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 5,
//           Deck: 5,
//         }),
//       );
//     });
//
//     It("Active player draws 5", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 10,
//           Inkwell: secondStarToTheRight.cost,
//           Hand: [secondStarToTheRight],
//         },
//         {
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.playCard(secondStarToTheRight, {
//         TargetPlayer: "player_one",
//       });
//
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 10,
//         }),
//       );
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 5,
//           Deck: 5,
//         }),
//       );
//     });
//   });
// });
//
