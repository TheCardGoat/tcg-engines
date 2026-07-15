// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pigletPoohPirateCaptain } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { diabloDevotedHerald } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   DaisyDuckPirateCaptain,
//   PerilousMazeWateryLabyrinth,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Distant Shores", () => {
//   It("Whenever one of your Pirate characters quests while at a location, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: daisyDuckPirateCaptain.cost + pigletPoohPirateCaptain.cost + 1,
//       Play: [
//         PigletPoohPirateCaptain,
//         DaisyDuckPirateCaptain,
//         PerilousMazeWateryLabyrinth,
//       ],
//       Hand: 0,
//       Deck: 1,
//     });
//
//     Const loc = testEngine.getCardModel(perilousMazeWateryLabyrinth);
//     Const piglet = testEngine.getCardModel(pigletPoohPirateCaptain);
//
//     Await testEngine.moveToLocation({
//       Character: piglet,
//       Location: loc,
//     });
//
//     Piglet.quest();
//
//     Expect(testEngine.getZonesCardCount().deck).toEqual(0);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
//
//   It("Questing character is not a pirate", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: daisyDuckPirateCaptain.cost + diabloDevotedHerald.cost + 1,
//       Play: [
//         DiabloDevotedHerald,
//         DaisyDuckPirateCaptain,
//         PerilousMazeWateryLabyrinth,
//       ],
//       Hand: 0,
//       Deck: 1,
//     });
//
//     Const loc = testEngine.getCardModel(perilousMazeWateryLabyrinth);
//     Const diablo = testEngine.getCardModel(diabloDevotedHerald);
//
//     Await testEngine.moveToLocation({
//       Character: diablo,
//       Location: loc,
//     });
//
//     Diablo.quest();
//
//     Expect(testEngine.getZonesCardCount().deck).toEqual(1);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(0);
//   });
// });
//
