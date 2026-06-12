import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { cobraBubblesJustASocialWorker } from "../characters";
import { worldsGreatestCriminalMind } from "./031-worlds-greatest-criminal-mind";

describe("World's Greatest Criminal Mind", () => {
  it("banishes chosen character with 5 strength or more", () => {
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
    expect(testEngine.asPlayerTwo().getCardZone(cobraBubblesJustASocialWorker)).toEqual("discard");
  });

  it("cannot banish a character with less than 5 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [worldsGreatestCriminalMind],
        inkwell: worldsGreatestCriminalMind.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(worldsGreatestCriminalMind, {
        targets: [simbaProtectiveCub],
      }),
    ).toMatchObject({
      success: false,
      errorCode: "INVALID_ACTION_TARGET",
    });

    expect(testEngine.asPlayerOne().getCardZone(worldsGreatestCriminalMind)).toEqual("hand");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toEqual("play");
  });
});
