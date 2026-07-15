import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { youCanFly } from "./133-you-can-fly";

describe("You Can Fly!", () => {
  it("gives Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youCanFly],
        inkwell: youCanFly.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [arielOnHumanLegs],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(youCanFly, {
      targets: [arielOnHumanLegs],
    });
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(true);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Evasive")).toBe(false);
  });
});
