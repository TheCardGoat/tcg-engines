import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { standOutEpic } from "./213-stand-out-epic";

describe("Stand Out Epic", () => {
  it("buffs the chosen character until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [standOutEpic],
        inkwell: standOutEpic.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [arielOnHumanLegs],
      },
    );
    const baseStrength = testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs);

    expect(
      testEngine.asPlayerOne().playCard(standOutEpic, {
        targets: [arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs)).toBe(baseStrength + 3);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs)).toBe(baseStrength);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(false);
  });
});
