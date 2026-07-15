import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { dragonFire } from "./133-dragon-fire";

describe("Dragon Fire", () => {
  it("banishes the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(dragonFire, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });
});
