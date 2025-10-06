/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { diabloDevotedHerald } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { perilousMazeWateryLabyrinth } from "~/game-engine/engines/lorcana/src/cards/definitions/006";

describe("Perilous Maze", () => {
  it.skip("LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: perilousMazeWateryLabyrinth.cost + diabloDevotedHerald.cost + 1,
      play: [],
      hand: [perilousMazeWateryLabyrinth, diabloDevotedHerald],
    });

    const loc = testEngine.getCardModel(perilousMazeWateryLabyrinth);
    const diablo = testEngine.getCardModel(diabloDevotedHerald);

    await testEngine.playCard(perilousMazeWateryLabyrinth);
    await testEngine.playCard(diabloDevotedHerald);
    diablo.enterLocation(loc);
  });
});
