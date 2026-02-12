// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   RobinHoodEphemeralArcher,
//   TimeToGo,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Time to Go!", () => {
//   Describe("Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.", () => {
//     It("Having a card under them", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: timeToGo.cost + 1,
//         Play: [robinHoodEphemeralArcher],
//         Hand: [timeToGo],
//         Deck: 10,
//       });
//
//       Await testEngine.activateCard(robinHoodEphemeralArcher);
//       Expect(
//         TestEngine.getCardModel(robinHoodEphemeralArcher).cardsUnder,
//       ).toHaveLength(1);
//
//       Await testEngine.playCard(timeToGo);
//
//       Await testEngine.resolveTopOfStack({
//         Targets: [robinHoodEphemeralArcher],
//       });
//
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Deck: 6,
//           Hand: 3,
//         }),
//       );
//     });
//
//     It("Not having a card under them", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: timeToGo.cost + 1,
//         Play: [robinHoodEphemeralArcher],
//         Hand: [timeToGo],
//         Deck: 10,
//       });
//
//       Await testEngine.playCard(timeToGo);
//
//       Await testEngine.resolveTopOfStack({
//         Targets: [robinHoodEphemeralArcher],
//       });
//
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Deck: 8,
//           Hand: 2,
//         }),
//       );
//     });
//   });
// });
//
