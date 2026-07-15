import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { cobraBubblesJustASocialWorker } from "../../002/characters";
import { worldsGreatestCriminalMind } from "./030-worlds-greatest-criminal-mind";

describe("World's Greatest Criminal Mind", () => {
  it("banishes the chosen character with 5 strength or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [worldsGreatestCriminalMind],
        inkwell: worldsGreatestCriminalMind.cost,
      },
      {
        play: [cobraBubblesJustASocialWorker],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(worldsGreatestCriminalMind, {
        targets: [cobraBubblesJustASocialWorker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(cobraBubblesJustASocialWorker)).toBe("discard");
  });
});
