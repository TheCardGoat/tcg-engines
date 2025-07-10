import { describe, expect, test } from "bun:test";
import { LorcanaTestEngine } from "../../../testing/lorcana-test-engine.ts";

describe("During Game sets the game to the 'duringGame' segment, 'mainPhase' phase, and 'idle' step", () => {
  test("skipPreGame: true", () => {
    const testEngine = new LorcanaTestEngine(
      {
        deck: 30,
      },
      {
        deck: 30,
      },
      { skipPreGame: true },
    );

    expect(testEngine.getGameSegment()).toEqual("duringGame");
    expect(testEngine.getGamePhase()).toEqual("mainPhase");
    expect(testEngine.getGameStep()).toEqual("idle");
  });
});
