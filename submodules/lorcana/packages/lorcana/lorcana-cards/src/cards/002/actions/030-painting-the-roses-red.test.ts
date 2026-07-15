import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { dopeyAlwaysPlayful, eudoraAccomplishedSeamstress } from "../../002";
import { paintingTheRosesRed } from "./030-painting-the-roses-red";

describe("Painting the Roses Red", () => {
  it("draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [paintingTheRosesRed],
      inkwell: paintingTheRosesRed.cost,
      deck: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(paintingTheRosesRed, {
        targets: [],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });

  it("gives up to 2 chosen characters -1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [paintingTheRosesRed],
        inkwell: paintingTheRosesRed.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [dopeyAlwaysPlayful, eudoraAccomplishedSeamstress],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(paintingTheRosesRed, {
        targets: [dopeyAlwaysPlayful, eudoraAccomplishedSeamstress],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(dopeyAlwaysPlayful)).toBe(
      dopeyAlwaysPlayful.strength - 1,
    );
    expect(testEngine.asPlayerOne().getCardStrength(eudoraAccomplishedSeamstress)).toBe(
      eudoraAccomplishedSeamstress.strength - 1,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(dopeyAlwaysPlayful)).toBe(
      dopeyAlwaysPlayful.strength,
    );
    expect(testEngine.asPlayerOne().getCardStrength(eudoraAccomplishedSeamstress)).toBe(
      eudoraAccomplishedSeamstress.strength,
    );
  });
});
