import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { weveGotCompany } from "./147-weve-got-company";

describe("We've Got Company!", () => {
  it("readies all your characters and gives them Reckless this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weveGotCompany],
      inkwell: weveGotCompany.cost,
      deck: [arielOnHumanLegs, simbaProtectiveCub],
      play: [arielOnHumanLegs, simbaProtectiveCub],
    });

    expect(testEngine.asServer().manualExertCard(arielOnHumanLegs)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(simbaProtectiveCub)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(weveGotCompany)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeReady(arielOnHumanLegs);
    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
    expect(testEngine.hasKeyword(arielOnHumanLegs, "Reckless")).toBe(true);
    expect(testEngine.hasKeyword(simbaProtectiveCub, "Reckless")).toBe(true);

    testEngine.asServer().passTurn();

    expect(testEngine.hasKeyword(arielOnHumanLegs, "Reckless")).toBe(false);
    expect(testEngine.hasKeyword(simbaProtectiveCub, "Reckless")).toBe(false);
  });
});
