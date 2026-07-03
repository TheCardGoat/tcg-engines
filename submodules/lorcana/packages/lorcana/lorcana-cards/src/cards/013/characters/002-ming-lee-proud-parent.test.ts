import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { mingLeeProudParent } from "./002-ming-lee-proud-parent";

const meilinLee = createMockCharacter({
  id: "ming-proud-parent-meilin",
  name: "Meilin Lee",
  version: "Supportive Daughter",
  cost: 1,
});

const turnSong = createMockSong({
  id: "ming-proud-parent-song",
  name: "Turning Red Song",
  cost: 1,
  text: "A song for Ming Lee.",
});

describe("Ming Lee - Proud Parent", () => {
  it("costs 1 less when Meilin Lee is in play and you have not played a song this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mingLeeProudParent],
      inkwell: 2,
      play: [meilinLee],
    });

    expect(testEngine.asPlayerOne().playCard(mingLeeProudParent)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mingLeeProudParent)).toBe("play");
  });

  it("costs 1 less when you played a song this turn and Meilin Lee is not in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [turnSong, mingLeeProudParent],
      inkwell: 3,
    });

    expect(testEngine.asPlayerOne().playCard(turnSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(mingLeeProudParent)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mingLeeProudParent)).toBe("play");
  });

  it("costs 2 less when Meilin Lee is in play and you played a song this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [turnSong, mingLeeProudParent],
      inkwell: 2,
      play: [meilinLee],
    });

    expect(testEngine.asPlayerOne().playCard(turnSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(mingLeeProudParent)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mingLeeProudParent)).toBe("play");
  });
});
