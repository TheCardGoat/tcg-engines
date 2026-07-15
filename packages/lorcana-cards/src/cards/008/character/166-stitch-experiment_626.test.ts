// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurDeterminedSquire,
//   RoquefortLockExpert,
//   StitchExperiment_626,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stitch - Experiment 626", () => {
//   It("SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: stitchExperiment_626.cost,
//         Hand: [stitchExperiment_626],
//         Deck: 10,
//       },
//       {
//         Deck: 10,
//       },
//     );
//
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Deck: 10,
//         Inkwell: 0,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Deck: 10,
//         Inkwell: stitchExperiment_626.cost,
//       }),
//     );
//     Await testEngine.playCard(stitchExperiment_626);
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Deck: 9,
//         Inkwell: 1,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Deck: 10,
//         Inkwell: stitchExperiment_626.cost,
//       }),
//     );
//   });
//
//   It("STEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play him for free and he enters play exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [arthurDeterminedSquire, roquefortLockExpert],
//       Discard: [stitchExperiment_626],
//     });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [arthurDeterminedSquire] });
//
//     Expect(testEngine.getCardModel(arthurDeterminedSquire).zone).toEqual(
//       "discard",
//     );
//     Expect(testEngine.getCardModel(stitchExperiment_626).zone).toEqual("play");
//     Expect(testEngine.getCardModel(stitchExperiment_626).exerted).toEqual(true);
//   });
//
//   It("STEALTH MODE - Cancelling effect", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [arthurDeterminedSquire],
//       Discard: [stitchExperiment_626],
//     });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Await testEngine.skipTopOfStack();
//
//     Expect(testEngine.getCardModel(arthurDeterminedSquire).zone).toEqual(
//       "hand",
//     );
//     Expect(testEngine.getCardModel(stitchExperiment_626).zone).toEqual(
//       "discard",
//     );
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
