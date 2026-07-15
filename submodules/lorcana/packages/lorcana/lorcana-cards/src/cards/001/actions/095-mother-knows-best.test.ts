import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, moanaOfMotunui } from "../characters";
import { motherKnowsBest } from "./095-mother-knows-best";

describe("Mother Knows Best", () => {
  it("returns the chosen character to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [motherKnowsBest],
        inkwell: motherKnowsBest.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(motherKnowsBest, {
      targets: [arielOnHumanLegs],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("hand");
  });

  it("returns your own character to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [motherKnowsBest],
      inkwell: motherKnowsBest.cost,
      play: [moanaOfMotunui],
    });

    const playResult = testEngine.asPlayerOne().playCard(motherKnowsBest, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toBe("hand");
  });
});
