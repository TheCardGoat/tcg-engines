import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { ragingStorm } from "./028-raging-storm";

describe("Raging Storm", () => {
  it("banishes all characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ragingStorm],
        inkwell: ragingStorm.cost,
        play: [heiheiBoatSnack],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(ragingStorm)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });
});
