// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeyondTheHorizon,
//   FredMajorScienceEnthusiast,
//   LouisEndearingAlligator,
//   MadDogKarnagesFirstMate,
//   NapoleonCleverBloodhound,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beyond The Horizon", () => {
//   It("Sing Together 7 (Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [beyondTheHorizon],
//     });
//
//     Expect(testEngine.getCardModel(beyondTheHorizon).hasSingTogether).toBe(
//       True,
//     );
//   });
//
//   It("Both Discard their hands", async () => {
//     Const initialHand = [
//       BeyondTheHorizon,
//       NapoleonCleverBloodhound,
//       LouisEndearingAlligator,
//       MadDogKarnagesFirstMate,
//       FredMajorScienceEnthusiast,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: beyondTheHorizon.cost,
//         Hand: initialHand,
//         Deck: 10,
//       },
//       {
//         Hand: 10,
//         Deck: 10,
//       },
//     );
//
//     Await testEngine.playCard(beyondTheHorizon, { mode: "1" });
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 3,
//         Deck: 10 - 3,
//         Discard: initialHand.length,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 3,
//         Deck: 10 - 3,
//         Discard: 10,
//       }),
//     );
//   });
//
//   It("Only player discards", async () => {
//     Const initialHand = [
//       BeyondTheHorizon,
//       NapoleonCleverBloodhound,
//       LouisEndearingAlligator,
//       MadDogKarnagesFirstMate,
//       FredMajorScienceEnthusiast,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: beyondTheHorizon.cost,
//         Hand: initialHand,
//         Deck: 10,
//       },
//       {
//         Hand: 10,
//         Deck: 10,
//       },
//     );
//
//     Await testEngine.playCard(beyondTheHorizon, { mode: "2" });
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 3,
//         Deck: 10 - 3,
//         Discard: initialHand.length,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 10,
//         Deck: 10,
//         Discard: 0,
//       }),
//     );
//   });
//
//   It("Only opponent discards", async () => {
//     Const initialHand = [
//       BeyondTheHorizon,
//       NapoleonCleverBloodhound,
//       LouisEndearingAlligator,
//       MadDogKarnagesFirstMate,
//       FredMajorScienceEnthusiast,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: beyondTheHorizon.cost,
//         Hand: initialHand,
//         Deck: 10,
//       },
//       {
//         Hand: 10,
//         Deck: 10,
//       },
//     );
//
//     Await testEngine.playCard(beyondTheHorizon, { mode: "3" });
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: initialHand.length - 1,
//         Deck: 10,
//         Discard: 1,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 3,
//         Deck: 10 - 3,
//         Discard: 10,
//       }),
//     );
//   });
// });
//
