import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { stoppedChaosInItsTracks } from "./115-stopped-chaos-in-its-tracks";

describe("Stopped Chaos in Its Tracks", () => {
  it("returns up to 2 chosen characters with 3 strength or less to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stoppedChaosInItsTracks],
        inkwell: stoppedChaosInItsTracks.cost,
      },
      {
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(stoppedChaosInItsTracks, {
        targets: [simbaProtectiveCub, mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
  });
});
