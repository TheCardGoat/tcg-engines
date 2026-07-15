// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   DocLeaderOfTheSevenDwarfs,
//   DopeyAlwaysPlayful,
//   SleepyNoddingOff,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dopey - Always Playful", () => {
//   It("**ODD ONE OUT** When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: smash.cost,
//         Hand: [smash],
//         Deck: 1,
//         Play: [
//           DopeyAlwaysPlayful,
//           SleepyNoddingOff,
//           DocLeaderOfTheSevenDwarfs,
//           LiloMakingAWish,
//         ],
//       },
//       { deck: 1 },
//     );
//
//     Await testEngine.playCard(smash);
//     Await testEngine.resolveTopOfStack({
//       Targets: [dopeyAlwaysPlayful],
//     });
//     Expect(testEngine.getCardModel(dopeyAlwaysPlayful).zone).toEqual("discard");
//
//     Expect(testEngine.getCardModel(liloMakingAWish).strength).toEqual(
//       LiloMakingAWish.strength,
//     );
//     Const dwarves = [
//       TestEngine.getCardModel(docLeaderOfTheSevenDwarfs),
//       TestEngine.getCardModel(sleepyNoddingOff),
//     ];
//
//     Dwarves.forEach((card) => {
//       Expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) + 2);
//     });
//
//     Await testEngine.passTurn("player_one");
//
//     Dwarves.forEach((card) => {
//       Expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) + 2);
//     });
//
//     Await testEngine.passTurn("player_two");
//
//     Dwarves.forEach((card) => {
//       Expect(card.strength).toEqual(card.lorcanitoCard.strength);
//     });
//   });
// });
//
