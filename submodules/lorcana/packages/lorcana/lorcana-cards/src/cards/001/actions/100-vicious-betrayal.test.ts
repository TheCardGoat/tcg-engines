import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { hadesLordOfTheUnderworld, moanaOfMotunui } from "../characters";
import { viciousBetrayal } from "./100-vicious-betrayal";

describe("Vicious Betrayal", () => {
  it("gives +2 strength this turn to a non-Villain chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [viciousBetrayal],
      inkwell: viciousBetrayal.cost,
      play: [moanaOfMotunui],
    });

    expect(testEngine.asPlayerOne().getCardStrength(moanaOfMotunui)).toEqual(
      moanaOfMotunui.strength,
    );

    const playResult = testEngine.asPlayerOne().playCard(viciousBetrayal, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(moanaOfMotunui)).toEqual(
      moanaOfMotunui.strength + 2,
    );
  });

  it("gives +3 strength this turn to a chosen Villain character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [viciousBetrayal],
      inkwell: viciousBetrayal.cost,
      play: [hadesLordOfTheUnderworld],
    });

    expect(testEngine.asPlayerOne().getCardStrength(hadesLordOfTheUnderworld)).toEqual(
      hadesLordOfTheUnderworld.strength,
    );

    const playResult = testEngine.asPlayerOne().playCard(viciousBetrayal, {
      targets: [hadesLordOfTheUnderworld],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(hadesLordOfTheUnderworld)).toEqual(
      hadesLordOfTheUnderworld.strength + 3,
    );
  });
});
