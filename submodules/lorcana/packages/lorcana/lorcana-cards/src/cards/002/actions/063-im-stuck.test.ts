import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { imStuck } from "./063-im-stuck";

describe("I'm Stuck!", () => {
  it("prevents the chosen exerted character from readying at the start of their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [imStuck],
        inkwell: imStuck.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);
    testEngine.asServer().manualExertCard(simbaId);
    const playResult = testEngine.asPlayerOne().playCard(imStuck, {
      targets: [simbaProtectiveCub],
    });
    expect(playResult).toBeSuccessfulCommand();

    testEngine.asServer().passTurn();
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
    expect(testEngine.hasRestriction(simbaProtectiveCub, "cant-ready")).toBe(true);
  });
});
