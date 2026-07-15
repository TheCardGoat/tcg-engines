import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { fourDozenEggs } from "./164-four-dozen-eggs";

describe("Four Dozen Eggs", () => {
  it("gives your characters Resist +2 until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fourDozenEggs],
        inkwell: fourDozenEggs.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [arielOnHumanLegs, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(fourDozenEggs)).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(arielOnHumanLegs, "Resist")).toBe(2);
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(2);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(arielOnHumanLegs, "Resist")).toBe(2);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(arielOnHumanLegs, "Resist")).toBeNull();
  });
});
