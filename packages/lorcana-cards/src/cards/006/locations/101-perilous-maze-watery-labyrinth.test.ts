// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { diabloDevotedHerald } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { perilousMazeWateryLabyrinth } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Perilous Maze", () => {
//   It.skip("LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: perilousMazeWateryLabyrinth.cost + diabloDevotedHerald.cost + 1,
//       Play: [],
//       Hand: [perilousMazeWateryLabyrinth, diabloDevotedHerald],
//     });
//
//     Const loc = testEngine.getCardModel(perilousMazeWateryLabyrinth);
//     Const diablo = testEngine.getCardModel(diabloDevotedHerald);
//
//     Await testEngine.playCard(perilousMazeWateryLabyrinth);
//     Await testEngine.playCard(diabloDevotedHerald);
//     Diablo.enterLocation(loc);
//   });
// });
//
