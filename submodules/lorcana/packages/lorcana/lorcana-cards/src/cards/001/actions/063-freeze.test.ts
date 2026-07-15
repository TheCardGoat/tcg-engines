import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { freeze } from "./063-freeze";
import { moanaOfMotunui } from "../characters/014-moana-of-motunui";

describe("Freeze", () => {
  it("exerts chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [freeze],
        inkwell: freeze.cost,
      },
      {
        play: [moanaOfMotunui],
      },
    );

    expect(testEngine.asPlayerTwo().isExerted(moanaOfMotunui)).toBeFalsy();

    testEngine.asPlayerOne().playCard(freeze, {
      targets: [moanaOfMotunui],
    });

    expect(testEngine.asPlayerOne().getCardZone(freeze)).toEqual("discard");
    expect(testEngine.asPlayerTwo().isExerted(moanaOfMotunui)).toBe(true);
  });
});
