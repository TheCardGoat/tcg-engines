import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { forestDuel } from "./077-forest-duel";

describe("Forest Duel", () => {
  it("grants Challenger +2 and returns your character to hand when it is banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [forestDuel],
        inkwell: forestDuel.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );
    testEngine.asServer().manualExertCard(mickeyMouseTrueFriend);

    expect(testEngine.asPlayerOne().playCard(forestDuel)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(simbaProtectiveCub, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
