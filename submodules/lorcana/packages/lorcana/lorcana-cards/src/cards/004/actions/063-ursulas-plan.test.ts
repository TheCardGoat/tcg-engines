import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { ursulasPlan } from "./063-ursulas-plan";

describe("Ursula's Plan", () => {
  it("lets the opponent choose a character to exert and prevents that character from readying next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ursulasPlan],
        inkwell: ursulasPlan.cost,
      },
      {
        play: [simbaProtectiveCub, arielOnHumanLegs],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "player_two");

    expect(testEngine.asPlayerOne().playCard(ursulasPlan).success).toBe(true);
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [simbaId] }).success).toBe(true);

    expect(testEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.exerted).toBe(true);
    expect(testEngine.hasRestriction(simbaProtectiveCub, "cant-ready")).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.exerted).toBe(true);
  });
});
