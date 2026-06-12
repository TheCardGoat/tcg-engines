import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { nothingWeWontDo } from "./147-nothing-we-wont-do";

describe("Nothing We Won't Do", () => {
  it("readies your characters and gives them the no-challenge-damage and cant-quest effects for the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nothingWeWontDo],
      inkwell: nothingWeWontDo.cost,
      play: [simbaProtectiveCub, mickeyMouseTrueFriend],
    });
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p1");

    testEngine.asServer().manualExertCard(simbaId);
    testEngine.asServer().manualExertCard(mickeyId);

    expect(testEngine.asPlayerOne().playCard(nothingWeWontDo)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(mickeyMouseTrueFriend)).toBe(false);
    expect(testEngine.hasRestriction(simbaProtectiveCub, "cant-quest")).toBe(true);
    expect(testEngine.hasRestriction(mickeyMouseTrueFriend, "cant-quest")).toBe(true);
    expect(
      testEngine
        .asPlayerOne()
        .hasTemporaryAbility(simbaProtectiveCub, "takes-no-damage-from-challenges"),
    ).toBe(true);
    expect(
      testEngine
        .asPlayerOne()
        .hasTemporaryAbility(mickeyMouseTrueFriend, "takes-no-damage-from-challenges"),
    ).toBe(true);
  });
});
