import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { revive } from "./027-revive";

describe("Revive", () => {
  it("plays a character with cost 5 or less from your discard for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [revive],
      inkwell: revive.cost,
      discard: [simbaProtectiveCub],
    });

    const playResult = testEngine.asPlayerOne().playCard(revive, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ discard: 1, play: 1 });
  });
});
