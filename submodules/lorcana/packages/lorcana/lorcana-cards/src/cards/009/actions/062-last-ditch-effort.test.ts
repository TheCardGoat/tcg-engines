import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { lastditchEffort } from "./062-last-ditch-effort";

describe("Last-Ditch Effort", () => {
  it("exerts a chosen opposing character and gives your chosen character Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lastditchEffort],
        inkwell: lastditchEffort.cost,
        play: [arielOnHumanLegs, mickeyMouseTrueFriend],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(lastditchEffort, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
    expect(testEngine.getKeywordValue(arielOnHumanLegs, "Challenger")).toBe(2);
  });
});
