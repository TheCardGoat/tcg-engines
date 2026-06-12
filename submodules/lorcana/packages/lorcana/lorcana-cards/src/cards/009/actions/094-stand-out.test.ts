import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { standOut } from "./094-stand-out";

describe("Stand Out", () => {
  it("buffs the chosen character until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [standOut],
        inkwell: standOut.cost,
        deck: [arielOnHumanLegs, arielOnHumanLegs],
      },
      {
        deck: [arielOnHumanLegs, arielOnHumanLegs],
        play: [arielOnHumanLegs],
      },
    );
    const baseStrength = testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs);

    expect(
      testEngine.asPlayerOne().playCard(standOut, { targets: [arielOnHumanLegs] }).success,
    ).toBe(true);
    expect(testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs)).toBe(baseStrength + 3);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs)).toBe(baseStrength + 3);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(arielOnHumanLegs)).toBe(baseStrength);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(false);
  });
});
