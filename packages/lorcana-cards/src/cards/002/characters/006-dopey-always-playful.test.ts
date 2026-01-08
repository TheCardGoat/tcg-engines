// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   docLeaderOfTheSevenDwarfs,
//   dopeyAlwaysPlayful,
//   sleepyNoddingOff,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dopey - Always Playful", () => {
//   it("**ODD ONE OUT** When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: smash.cost,
//         hand: [smash],
//         deck: 1,
//         play: [
//           dopeyAlwaysPlayful,
//           sleepyNoddingOff,
//           docLeaderOfTheSevenDwarfs,
//           liloMakingAWish,
//         ],
//       },
//       { deck: 1 },
//     );
//
//     await testEngine.playCard(smash);
//     await testEngine.resolveTopOfStack({
//       targets: [dopeyAlwaysPlayful],
//     });
//     expect(testEngine.getCardModel(dopeyAlwaysPlayful).zone).toEqual("discard");
//
//     expect(testEngine.getCardModel(liloMakingAWish).strength).toEqual(
//       liloMakingAWish.strength,
//     );
//     const dwarves = [
//       testEngine.getCardModel(docLeaderOfTheSevenDwarfs),
//       testEngine.getCardModel(sleepyNoddingOff),
//     ];
//
//     dwarves.forEach((card) => {
//       expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) + 2);
//     });
//
//     await testEngine.passTurn("player_one");
//
//     dwarves.forEach((card) => {
//       expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) + 2);
//     });
//
//     await testEngine.passTurn("player_two");
//
//     dwarves.forEach((card) => {
//       expect(card.strength).toEqual(card.lorcanitoCard.strength);
//     });
//   });
// });
//
