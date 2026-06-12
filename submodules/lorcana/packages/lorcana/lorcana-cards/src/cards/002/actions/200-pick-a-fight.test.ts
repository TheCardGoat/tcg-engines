import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { pickAFight } from "./200-pick-a-fight";

describe("Pick a Fight", () => {
  it("lets the chosen character challenge ready characters this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pickAFight],
        inkwell: pickAFight.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [goofyKnightForADay],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(simbaProtectiveCub, goofyKnightForADay)).toBe(
      false,
    );
    expect(
      testEngine.asPlayerOne().playCardTo(pickAFight, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canChallenge(simbaProtectiveCub, goofyKnightForADay)).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(simbaProtectiveCub, goofyKnightForADay)).toBe(
      false,
    );
  });
});
